from fastapi import APIRouter, HTTPException
import psutil
import platform
import socket
from datetime import datetime
from typing import Dict, List
import os
import subprocess

router = APIRouter()

def get_size(bytes: int) -> str:
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes < 1024:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024
    return f"{bytes:.2f} PB"

@router.get("/info")
async def system_info():
    """Get general system information"""
    boot_time = datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.now() - boot_time
    
    return {
        "hostname": socket.gethostname(),
        "platform": platform.system(),
        "platform_version": platform.version(),
        "architecture": platform.machine(),
        "processor": platform.processor(),
        "python_version": platform.python_version(),
        "boot_time": boot_time.isoformat(),
        "uptime_seconds": int(uptime.total_seconds()),
        "uptime_formatted": str(uptime).split('.')[0]
    }

@router.get("/cpu")
async def cpu_info():
    """Get CPU information and usage"""
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    cpu_freq = psutil.cpu_freq()
    
    return {
        "count_physical": psutil.cpu_count(logical=False),
        "count_logical": cpu_count,
        "percent": cpu_percent,
        "frequency_mhz": cpu_freq.current if cpu_freq else None,
        "frequency_max_mhz": cpu_freq.max if cpu_freq else None,
        "load_average": os.getloadavg() if hasattr(os, 'getloadavg') else None,
        "per_cpu_percent": psutil.cpu_percent(interval=1, percpu=True)
    }

@router.get("/memory")
async def memory_info():
    """Get memory information"""
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    return {
        "total": get_size(memory.total),
        "available": get_size(memory.available),
        "used": get_size(memory.used),
        "percent": memory.percent,
        "swap_total": get_size(swap.total),
        "swap_used": get_size(swap.used),
        "swap_percent": swap.percent if swap.total > 0 else 0
    }

@router.get("/disk")
async def disk_info():
    """Get disk usage information"""
    partitions = []
    for partition in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            partitions.append({
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "fstype": partition.fstype,
                "total": get_size(usage.total),
                "used": get_size(usage.used),
                "free": get_size(usage.free),
                "percent": usage.percent
            })
        except PermissionError:
            continue
    
    return {"partitions": partitions}

@router.get("/network")
async def network_info():
    """Get network information"""
    interfaces = []
    io_counters = psutil.net_io_counters(pernic=True)
    
    for name, addr_list in psutil.net_if_addrs().items():
        addresses = []
        for addr in addr_list:
            addresses.append({
                "family": addr.family.name if hasattr(addr.family, 'name') else str(addr.family),
                "address": addr.address,
                "netmask": addr.netmask,
                "broadcast": addr.broadcast
            })
        
        io = io_counters.get(name)
        interfaces.append({
            "name": name,
            "addresses": addresses,
            "bytes_sent": io.bytes_sent if io else 0,
            "bytes_recv": io.bytes_recv if io else 0,
            "packets_sent": io.packets_sent if io else 0,
            "packets_recv": io.packets_recv if io else 0
        })
    
    return {"interfaces": interfaces}

@router.get("/processes")
async def process_info(limit: int = 20):
    """Get top processes by CPU usage"""
    processes = []
    for proc in sorted(psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'create_time']),
                       key=lambda x: x.info['cpu_percent'] or 0,
                       reverse=True)[:limit]:
        try:
            pinfo = proc.info
            processes.append({
                "pid": pinfo['pid'],
                "name": pinfo['name'],
                "cpu_percent": pinfo['cpu_percent'],
                "memory_percent": pinfo['memory_percent'],
                "created": datetime.fromtimestamp(pinfo['create_time']).isoformat() if pinfo['create_time'] else None
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    
    return {"processes": processes}

@router.get("/services")
async def services_info():
    """Get system services status"""
    services = []
    
    # Check OpenClaw
    try:
        result = subprocess.run(['pgrep', '-f', 'openclaw-gateway'], 
                              capture_output=True, text=True)
        openclaw_running = result.returncode == 0
        openclaw_pid = result.stdout.strip() if openclaw_running else None
    except:
        openclaw_running = False
        openclaw_pid = None
    
    services.append({
        "name": "openclaw-gateway",
        "status": "running" if openclaw_running else "stopped",
        "pid": openclaw_pid
    })
    
    # Check SSH
    try:
        result = subprocess.run(['pgrep', '-f', 'sshd'], 
                              capture_output=True, text=True)
        ssh_running = result.returncode == 0
    except:
        ssh_running = False
    
    services.append({
        "name": "sshd",
        "status": "running" if ssh_running else "stopped"
    })
    
    return {"services": services}

@router.get("/ports")
async def ports_info():
    """Get listening ports"""
    connections = []
    for conn in psutil.net_connections(kind='inet'):
        if conn.status == 'LISTEN':
            connections.append({
                "local_address": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else None,
                "pid": conn.pid,
                "status": conn.status
            })
    
    return {"listening_ports": connections}
