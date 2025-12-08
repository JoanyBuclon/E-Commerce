#!/bin/bash
# Quick Docker commands for back-office

# Build the image
echo "Building back-office Docker image..."
docker build -t back-office:latest .

# Run standalone
echo "To run standalone: docker run -p 9010:3000 back-office:latest"

# Or use docker-compose (from project root)
echo "To run with docker-compose: docker compose up -d back-office"

# View logs
echo "To view logs: docker compose logs -f back-office"

# Stop
echo "To stop: docker compose stop back-office"

# Rebuild
echo "To rebuild: docker compose up -d --build back-office"
