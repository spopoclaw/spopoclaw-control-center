from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "SpopoClaw Control Center"
    DEBUG: bool = False
    ENV: str = "production"
    
    # Security
    SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/callback"
    
    # Allowed Users (comma-separated emails)
    ALLOWED_USERS: str = "youssef.mahtat.as.developer@gmail.com,spopoclaw@gmail.com"
    
    # CORS - Updated for DuckDNS domain
    CORS_ORIGINS: List[str] = [
        "http://localhost:4200",
        "http://localhost:8080",
        "http://localhost:80",
        "http://95.111.236.247:8000",
        "http://spopoclaw.duckdns.org:8000"
    ]
    
    # OpenClaw
    OPENCLAW_GATEWAY_URL: str = "http://localhost:18789"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Parse ALLOWED_USERS as list
ALLOWED_USERS_LIST = [email.strip() for email in settings.ALLOWED_USERS.split(",")]
