from fastapi import APIRouter
import psutil
import platform
from datetime import datetime
import os

router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@router.get("/detailed")
async def detailed_health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "spopoclaw-control-center",
        "version": "1.0.0",
        "environment": os.getenv("ENV", "production")
    }
