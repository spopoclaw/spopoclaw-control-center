from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
import httpx
import jwt
from datetime import datetime, timedelta

from app.config import settings

router = APIRouter()

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

def create_jwt_token(email: str) -> str:
    expiration = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    payload = {
        "email": email,
        "exp": expiration,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/login")
async def login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        email = user_info.get('email')
        
        # Strict allowlist check
        if email not in settings.ALLOWED_USERS:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Email {email} is not authorized."
            )
        
        # Create JWT
        jwt_token = create_jwt_token(email)
        
        # Redirect to frontend with token
        frontend_url = "http://localhost:4200/auth/callback"
        return RedirectResponse(url=f"{frontend_url}?token={jwt_token}")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

@router.get("/verify")
async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = auth_header.split(" ")[1]
    payload = verify_jwt_token(token)
    
    return {"valid": True, "email": payload["email"]}

@router.get("/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.get("/allowed-users")
async def get_allowed_users():
    """Public endpoint to see allowed users (for frontend)"""
    return {"allowed_users": settings.ALLOWED_USERS}
