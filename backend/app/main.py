from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from app.routers import auth, health, system, openclaw, audit
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 SpopoClaw Control Center starting...")
    print(f"📝 Allowed users: {settings.ALLOWED_USERS}")
    yield
    print("🛑 Shutting down...")

app = FastAPI(
    title="SpopoClaw Control Center API",
    description="API d'administration et supervision pour SpopoClaw",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(system.router, prefix="/api/system", tags=["system"])
app.include_router(openclaw.router, prefix="/api/openclaw", tags=["openclaw"])
app.include_router(audit.router, prefix="/api/audit", tags=["audit"])

# Static files (frontend build)
frontend_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist", "frontend", "browser")
if os.path.exists(frontend_path):
    print(f"📁 Serving frontend from: {frontend_path}")
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")
    
    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(frontend_path, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_spa(path: str):
        # Serve index.html for all routes (SPA behavior)
        file_path = os.path.join(frontend_path, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    print(f"⚠️ Frontend not found at: {frontend_path}")
    print(f"📝 API-only mode")
    
    @app.get("/")
    async def root():
        return {
            "name": "SpopoClaw Control Center API",
            "version": "1.0.0",
            "status": "operational",
            "mode": "api-only"
        }
