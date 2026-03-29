#!/bin/bash
# Start SpopoClaw Control Center

cd /home/spopoclaw/codes-repositories/spopoclaw-control-center/backend

echo "🚀 Starting SpopoClaw Control Center..."
echo "📱 Frontend will be available at: http://95.111.236.247:8000"
echo "🔌 API endpoints at: http://95.111.236.247:8000/api/"
echo ""

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
