#!/bin/bash

# 1. Tentative de détection de l'IP (Spécifique macOS)
# On essaye en0 (souvent le Wi-Fi)
HOST_IP=$(ipconfig getifaddr en0)

# Si vide, on essaye en1 (souvent l'Ethernet)
if [ -z "$HOST_IP" ]; then
    HOST_IP=$(ipconfig getifaddr en1)
fi

# Si toujours vide, on cherche n'importe quelle IP non-loopback
if [ -z "$HOST_IP" ]; then
    HOST_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
fi

# Si vraiment rien n'est trouvé, fallback sur localhost
if [ -z "$HOST_IP" ]; then
    echo "⚠️  Impossible de détecter l'IP réseau locale. Fallback sur localhost."
    HOST_IP="127.0.0.1"
else
    echo "✅ Adresse IP réseau détectée : $HOST_IP"
fi

# 2. Export de la variable
export HOST_IP

# 3. Lancement de Docker Compose
echo "🚀 Lancement de la stack E-Commerce..."
echo "   - Front: http://localhost"
echo "   - Back-Office: http://admin.localhost"
echo "   - Traefik Dashboard: http://localhost:8080/dashboard/"
echo "   - Kafka Advertised Listener: $HOST_IP"
echo ""

# Utilisation de "docker compose" (V2)
docker compose up --remove-orphans
