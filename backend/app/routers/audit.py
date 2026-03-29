from fastapi import APIRouter, Request
from datetime import datetime
from typing import List, Dict
import json
import os

router = APIRouter()

# Simple in-memory audit log (will be lost on restart)
# In production, use a database
audit_logs: List[Dict] = []

def add_audit_event(event_type: str, description: str, user: str = None, metadata: dict = None):
    """Add an audit event"""
    event = {
        "id": len(audit_logs) + 1,
        "timestamp": datetime.utcnow().isoformat(),
        "type": event_type,
        "description": description,
        "user": user,
        "metadata": metadata or {}
    }
    audit_logs.insert(0, event)  # Most recent first
    
    # Keep only last 1000 events
    if len(audit_logs) > 1000:
        audit_logs.pop()
    
    return event

@router.get("/events")
async def get_audit_events(limit: int = 100, event_type: str = None):
    """Get audit events"""
    events = audit_logs
    
    if event_type:
        events = [e for e in events if e["type"] == event_type]
    
    return {"events": events[:limit], "total": len(audit_logs)}

@router.get("/events/types")
async def get_event_types():
    """Get unique event types"""
    types = set(e["type"] for e in audit_logs)
    return {"types": sorted(list(types))}

@router.post("/events")
async def create_audit_event(request: Request):
    """Create a new audit event (for internal use)"""
    data = await request.json()
    event = add_audit_event(
        event_type=data.get("type", "manual"),
        description=data.get("description", ""),
        user=data.get("user"),
        metadata=data.get("metadata")
    )
    return event

# System events logged on startup
@router.on_event("startup")
async def log_startup():
    add_audit_event(
        event_type="system",
        description="Control Center API started",
        metadata={"version": "1.0.0"}
    )
