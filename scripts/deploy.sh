#!/bin/bash
# Deploy script for SpopoClaw Control Center

echo "🚀 Deploying SpopoClaw Control Center..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found."
    exit 1
fi

# Check for .env
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please create one from backend/.env.example"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main 2>/dev/null || echo "⚠️  Could not pull changes"

# Build and deploy
echo "🏗️  Building and deploying..."
docker-compose down
docker-compose pull
docker-compose up --build -d

# Health check
echo "🏥 Running health checks..."
sleep 5

if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
fi

if curl -s http://localhost:8000/api/health/ > /dev/null; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
fi

echo ""
echo "🎉 Deployment complete!"
echo "📱 Access the application at: http://$(hostname -I | awk '{print $1}'):8080"
