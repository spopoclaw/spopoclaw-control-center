#!/bin/bash
# Development script for SpopoClaw Control Center

echo "🚀 Starting SpopoClaw Control Center in development mode..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Are you in the right directory?"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp backend/.env.example .env
    echo "⚠️  Please edit .env file with your Google OAuth credentials"
fi

# Start services
echo "🐳 Starting Docker Compose..."
docker-compose up --build -d

echo ""
echo "✅ Services started!"
echo "📱 Frontend: http://localhost:8080"
echo "🔌 API: http://localhost:8000"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
