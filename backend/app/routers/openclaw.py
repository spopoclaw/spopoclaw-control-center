from fastapi import APIRouter, HTTPException
import httpx
import os
from datetime import datetime
import subprocess

from app.config import settings

router = APIRouter()

@router.get("/status")
async def openclaw_status():
    """Get OpenClaw gateway status"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.OPENCLAW_GATEWAY_URL}/health", timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "online",
                    "gateway_url": settings.OPENCLAW_GATEWAY_URL,
                    "health_response": data,
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "degraded",
                    "gateway_url": settings.OPENCLAW_GATEWAY_URL,
                    "error": f"HTTP {response.status_code}",
                    "timestamp": datetime.utcnow().isoformat()
                }
    except Exception as e:
        return {
            "status": "offline",
            "gateway_url": settings.OPENCLAW_GATEWAY_URL,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/info")
async def openclaw_info():
    """Get OpenClaw configuration info"""
    try:
        # Get OpenClaw version
        result = subprocess.run(['openclaw', '--version'], 
                              capture_output=True, text=True, timeout=10)
        version = result.stdout.strip() if result.returncode == 0 else "unknown"
    except:
        version = "unknown"
    
    try:
        # Get channels list
        result = subprocess.run(['openclaw', 'channels', 'list'], 
                              capture_output=True, text=True, timeout=10)
        channels_output = result.stdout if result.returncode == 0 else ""
    except:
        channels_output = ""
    
    # Parse channels from output
    channels = []
    if "whatsapp" in channels_output.lower():
        channels.append("whatsapp")
    
    return {
        "version": version,
        "gateway_port": 18789,
        "channels": channels,
        "workspace": os.path.expanduser("~/.openclaw/workspace"),
        "config_path": os.path.expanduser("~/.openclaw/config.yaml")
    }

@router.get("/logs")
async def openclaw_logs(lines: int = 50):
    """Get recent OpenClaw logs (if available)"""
    log_entries = []
    
    # Check for log files
    log_paths = [
        os.path.expanduser("~/.openclaw/logs/gateway.log"),
        os.path.expanduser("~/.openclaw/gateway.log"),
        "/var/log/openclaw/gateway.log"
    ]
    
    for log_path in log_paths:
        if os.path.exists(log_path):
            try:
                with open(log_path, 'r') as f:
                    # Read last N lines
                    all_lines = f.readlines()
                    recent_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
                    log_entries = [line.strip() for line in recent_lines]
                    break
            except:
                continue
    
    if not log_entries:
        log_entries = ["No log files found or accessible"]
    
    return {"logs": log_entries}

@router.get("/config")
async def openclaw_config():
    """Get OpenClaw configuration summary (safe)"""
    config_summary = {}
    
    config_path = os.path.expanduser("~/.openclaw/config.yaml")
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                content = f.read()
                # Extract safe info only (no secrets)
                config_summary["exists"] = True
                config_summary["has_gateway_config"] = "gateway" in content.lower()
                config_summary["has_channels_config"] = "channels" in content.lower()
        except:
            config_summary["exists"] = False
            config_summary["error"] = "Could not read config"
    else:
        config_summary["exists"] = False
    
    return config_summary
