#!/bin/bash
# Start SpopoClaw Control Center

cd /home/spopoclaw/codes-repositories/spopoclaw-control-center/backend

echo "Starting SpopoClaw Control Center..."

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
