from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "SpopoClaw Control Center"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/callback")
    
    # Allowed Users (comma-separated emails)
    ALLOWED_USERS: List[str] = os.getenv("ALLOWED_USERS", "youssef.mahtat.as.developer@gmail.com,spopoclaw@gmail.com").split(",")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:4200", "http://localhost:8080", "http://localhost:80"]
    
    # OpenClaw
    OPENCLAW_GATEWAY_URL: str = os.getenv("OPENCLAW_GATEWAY_URL", "http://localhost:18789")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
