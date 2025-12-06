# Front-Office Docker Guide

This guide explains how to build and run the front-office application using Docker.

## Table of Contents
- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running the Container](#running-the-container)
- [Using Docker Compose](#using-docker-compose)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Option 1: Standalone Docker Container

```bash
# From the front-office-example directory
cd sites/front-office/front-office-example

# Build the Docker image
docker build -t front-office:latest .

# Run the container
docker run -p 9000:3000 \
  -e VITE_API_BASE_URL=http://localhost/api \
  front-office:latest
```

Access the application at: `http://localhost:9000`

### Option 2: Using Docker Compose (Recommended)

```bash
# From the project root directory
cd /path/to/E-Commerce

# Start all services including front-office
docker compose up -d front-office

# Or start everything
docker compose up -d
```

Access the application via Traefik at: `http://localhost` (after updating Traefik configuration)

---

## Building the Image

The Dockerfile uses a **multi-stage build** for optimal image size and security:

1. **Builder stage**: Installs dependencies and builds the SvelteKit application
2. **Production stage**: Creates a minimal runtime image with only the built application

### Build Command

```bash
# Basic build
docker build -t front-office:latest .

# Build with custom tag
docker build -t front-office:v1.0.0 .

# Build with no cache (clean build)
docker build --no-cache -t front-office:latest .
```

### Build Arguments

The Dockerfile uses build arguments for Vite environment variables (these must be set at build time):

```bash
# Build with custom API URLs
docker build \
  --build-arg VITE_API_BASE_URL=http://my-api.example.com/api \
  --build-arg VITE_PROFILING_URL=http://profiling.example.com:9001 \
  -t front-office:latest .
```

**Available build arguments:**
- `VITE_API_BASE_URL` (default: `http://localhost/api`)
- `VITE_PROFILING_URL`
- `VITE_CATALOGING_URL`
- `VITE_ORDERING_URL`
- `VITE_PAYING_URL`
- `VITE_SHIPPING_URL`

---

## Running the Container

### Basic Run

```bash
docker run -p 9000:3000 front-office:latest
```

### Run with Runtime Environment Variables

**Important:** VITE_* variables must be set at BUILD time, not runtime.

```bash
# Only runtime variables (PORT, HOST, NODE_ENV) can be changed at runtime
docker run -p 9000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  front-office:latest
```

To change API URLs, rebuild the image with new build arguments.

### Run in Detached Mode

```bash
docker run -d \
  --name front-office \
  -p 9000:3000 \
  -e VITE_API_BASE_URL=http://localhost/api \
  front-office:latest
```

### Run with Restart Policy

```bash
docker run -d \
  --name front-office \
  --restart unless-stopped \
  -p 9000:3000 \
  front-office:latest
```

---

## Using Docker Compose

### Configuration

The front-office service is already configured in the root `docker-compose.yml`:

```yaml
front-office:
  build:
    context: ./sites/front-office/front-office-example
    dockerfile: Dockerfile
    args:
      # Build-time arguments for Vite
      VITE_API_BASE_URL: http://localhost/api
      # VITE_PROFILING_URL: http://192.168.1.42:9001
  container_name: front-office
  ports:
    - "9000:3000"
  environment:
    # Runtime configuration only
    PORT: 3000
    HOST: 0.0.0.0
    NODE_ENV: production
  networks:
    - e-commerce-network
  restart: unless-stopped
```

### Commands

```bash
# Build the image
docker compose build front-office

# Start the service
docker compose up -d front-office

# View logs
docker compose logs -f front-office

# Stop the service
docker compose stop front-office

# Remove the container
docker compose down front-office

# Rebuild and restart
docker compose up -d --build front-office
```

### Integrating with Traefik

To route traffic through Traefik, update `traefik/dynamic.yml`:

```yaml
# Comment out the host machine URL
# front-office:
#   loadBalancer:
#     servers:
#       - url: "http://192.168.1.42:9000"

# Uncomment the Docker service URL
front-office:
  loadBalancer:
    servers:
      - url: "http://front-office:3000"
```

Then restart Traefik (or wait for hot-reload):
```bash
docker compose restart traefik
```

Access the application at: `http://localhost`

---

## Environment Variables

### Build-Time Variables (VITE_*)

**IMPORTANT:** These must be set at BUILD time using `--build-arg`, not at runtime!

Vite bakes these variables into the application during the build process. Changing them requires rebuilding the image.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for all API services | `http://localhost/api` |
| `VITE_PROFILING_URL` | Profiling service URL (overrides base) | - |
| `VITE_CATALOGING_URL` | Cataloging service URL (overrides base) | - |
| `VITE_ORDERING_URL` | Ordering service URL (overrides base) | - |
| `VITE_PAYING_URL` | Paying service URL (overrides base) | - |
| `VITE_SHIPPING_URL` | Shipping service URL (overrides base) | - |

**Example:**
```bash
# Build with custom API URLs
docker build \
  --build-arg VITE_API_BASE_URL=http://my-api.example.com/api \
  --build-arg VITE_PROFILING_URL=http://192.168.1.50:9001 \
  -t front-office:latest .
```

### Runtime Variables

These control the server behavior and CAN be changed at runtime:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3000` |
| `HOST` | Host address to bind | `0.0.0.0` |
| `NODE_ENV` | Node environment | `production` |

**Example:**
```bash
docker run -d \
  --name front-office \
  -p 8080:4000 \
  -e PORT=4000 \
  -e NODE_ENV=production \
  front-office:latest
```

### Example: Distributed Deployment

If your microservices are running on different machines, you need to **rebuild** the image:

```bash
# Build with distributed service URLs
docker build \
  --build-arg VITE_API_BASE_URL=http://gateway.example.com/api \
  --build-arg VITE_PROFILING_URL=http://192.168.1.50:9001 \
  --build-arg VITE_CATALOGING_URL=http://192.168.1.51:9002 \
  --build-arg VITE_ORDERING_URL=http://192.168.1.52:9003 \
  -t front-office:distributed .

# Run the built image
docker run -d \
  --name front-office \
  -p 9000:3000 \
  front-office:distributed
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker logs front-office
# Or with compose
docker compose logs front-office
```

**Common issues:**
- Port 3000 already in use inside container
- Missing environment variables
- Build failed due to missing dependencies

### Can't Connect to API Services

**From inside the container:**
- Use service names (e.g., `http://profiling:9001`) if services are in the same Docker network
- Use `host.docker.internal` to access host machine services (Docker Desktop)
- Use actual IP addresses for distributed deployments

**Example for local development (Docker Desktop):**
```bash
docker run -p 9000:3000 \
  -e VITE_API_BASE_URL=http://host.docker.internal/api \
  front-office:latest
```

### Build Fails

**Clean build:**
```bash
# Remove old images
docker rmi front-office:latest

# Build without cache
docker build --no-cache -t front-office:latest .
```

**Check Node/npm versions:**
The Dockerfile uses `node:20-alpine`. Ensure your local development uses compatible versions.

### Health Check Fails

The Dockerfile includes a health check that pings `http://localhost:3000/`. If it fails:

1. Check if the application is actually running
2. Verify PORT environment variable matches
3. Check application logs for startup errors

**Disable health check temporarily:**
```bash
docker run --no-healthcheck -p 9000:3000 front-office:latest
```

### Image Size Too Large

Current image size: ~150-200 MB (optimized with Alpine Linux)

**Further optimize:**
1. Use `.dockerignore` to exclude unnecessary files (already included)
2. Minimize dependencies in package.json
3. Use multi-stage builds (already implemented)

---

## Advanced Usage

### Using with Docker Networks

```bash
# Create a custom network
docker network create my-ecommerce-network

# Run container in the network
docker run -d \
  --name front-office \
  --network my-ecommerce-network \
  -p 9000:3000 \
  front-office:latest
```

### Volume Mounting for Development

**NOT RECOMMENDED for this Dockerfile** as it's optimized for production. Use `npm run dev` for development instead.

### Running Multiple Instances

```bash
# Instance 1
docker run -d --name front-office-1 -p 9001:3000 front-office:latest

# Instance 2
docker run -d --name front-office-2 -p 9002:3000 front-office:latest

# Use a load balancer (like Traefik) to distribute traffic
```

---

## Performance Tips

1. **Use multi-stage builds** (already implemented in Dockerfile)
2. **Minimize layer count** by chaining commands
3. **Use .dockerignore** to exclude unnecessary files
4. **Pin dependency versions** in package.json
5. **Use health checks** for container orchestration
6. **Set appropriate restart policies** for production

---

## Security Considerations

1. **Non-root user**: Consider adding a non-root user in Dockerfile
2. **Scan for vulnerabilities**: Use `docker scan front-office:latest`
3. **Keep base image updated**: Regularly update `node:20-alpine`
4. **Don't commit secrets**: Never put sensitive data in .env files committed to Git
5. **Use environment variables**: For configuration instead of hardcoding values

---

## Next Steps

- [ ] Add health check endpoint in SvelteKit application
- [ ] Implement graceful shutdown handling
- [ ] Add metrics/monitoring (Prometheus, etc.)
- [ ] Create CI/CD pipeline for automated builds
- [ ] Add security scanning to build process
- [ ] Consider using distroless images for even smaller size

---

## Additional Resources

- [SvelteKit Deployment](https://kit.svelte.dev/docs/building-your-app)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
