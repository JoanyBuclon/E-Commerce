#!/bin/bash
# Quick Docker commands for front-office

# Build the image
echo "Building front-office Docker image..."
docker build -t front-office:latest .

# Run standalone
echo "To run standalone: docker run -p 9000:3000 front-office:latest"

# Or use docker-compose (from project root)
echo "To run with docker-compose: docker compose up -d front-office"

# View logs
echo "To view logs: docker compose logs -f front-office"

# Stop
echo "To stop: docker compose stop front-office"

# Rebuild
echo "To rebuild: docker compose up -d --build front-office"
