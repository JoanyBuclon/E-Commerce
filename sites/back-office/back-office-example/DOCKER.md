# Back-Office Docker Guide

Complete guide for building and running the back-office SvelteKit application in Docker.

## Table of Contents
- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running the Container](#running-the-container)
- [Docker Compose Integration](#docker-compose-integration)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Performance Tips](#performance-tips)
- [Security Considerations](#security-considerations)

## Quick Start

### Option 1: Standalone Container

```bash
# Build the image
docker build -t back-office:latest .

# Run the container
docker run -p 9010:3000 back-office:latest
```

Access the application at: **http://localhost:9010** or **http://admin.localhost** (via Traefik)

### Option 2: Docker Compose (Recommended)

From the project root:

```bash
# Build and start
docker compose up -d back-office

# View logs
docker compose logs -f back-office

# Stop
docker compose down back-office
```

Then update `traefik/dynamic.yml` to point to `http://back-office:3000` for Traefik routing.

## Building the Image

### Basic Build

```bash
docker build -t back-office:latest .
```

### Build with Custom API Base URL

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://api.mycompany.com \
  -t back-office:production .
```

### Build with Specific Service URLs

```bash
docker build \
  --build-arg VITE_PROFILING_URL=http://192.168.1.50:9001 \
  --build-arg VITE_CATALOGING_URL=http://192.168.1.50:9002 \
  --build-arg VITE_ORDERING_URL=http://192.168.1.50:9003 \
  --build-arg VITE_PAYING_URL=http://192.168.1.50:9004 \
  --build-arg VITE_SHIPPING_URL=http://192.168.1.50:9005 \
  -t back-office:latest .
```

### Build Arguments Reference

| Argument | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost/api` | Base URL for API endpoints |
| `VITE_PROFILING_URL` | - | Override PROFILING service URL |
| `VITE_CATALOGING_URL` | - | Override CATALOGING service URL |
| `VITE_ORDERING_URL` | - | Override ORDERING service URL |
| `VITE_PAYING_URL` | - | Override PAYING service URL |
| `VITE_SHIPPING_URL` | - | Override SHIPPING service URL |

**Important**: These are **build-time** variables that are baked into the application bundle. To change them, you must rebuild the image.

## Running the Container

### Basic Run

```bash
docker run -d \
  --name back-office \
  -p 9010:3000 \
  back-office:latest
```

### Run with Custom Port

```bash
docker run -d \
  --name back-office \
  -p 8080:3000 \
  -e PORT=3000 \
  back-office:latest
```

### Run with Network (for Docker Compose)

```bash
docker run -d \
  --name back-office \
  --network e-commerce-network \
  -p 9010:3000 \
  back-office:latest
```

### Run with Logs

```bash
# Follow logs
docker logs -f back-office

# View last 100 lines
docker logs --tail 100 back-office
```

### Stop and Remove

```bash
docker stop back-office
docker rm back-office
```

## Docker Compose Integration

The back-office service is pre-configured in the project's `docker-compose.yml`:

```yaml
back-office:
  build:
    context: ./sites/back-office/back-office-example
    dockerfile: Dockerfile
    args:
      VITE_API_BASE_URL: http://localhost/api
  container_name: back-office
  ports:
    - "9010:3000"
  environment:
    PORT: 3000
    HOST: 0.0.0.0
    NODE_ENV: production
  networks:
    - e-commerce-network
  restart: unless-stopped
```

### Using with Traefik

To route traffic through Traefik to the containerized back-office:

1. **Start the back-office container**:
   ```bash
   docker compose up -d back-office
   ```

2. **Update `traefik/dynamic.yml`**:
   ```yaml
   back-office:
     loadBalancer:
       servers:
         - url: "http://back-office:3000"  # Docker service name
   ```

3. **Access via Traefik**:
   - Add `127.0.0.1 admin.localhost` to your `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows)
   - Access: **http://admin.localhost**

Traefik will automatically reload the configuration (hot-reload enabled).

### Common Commands

```bash
# Build and start back-office
docker compose up -d back-office

# Rebuild after code changes
docker compose up -d --build back-office

# View logs
docker compose logs -f back-office

# Stop
docker compose stop back-office

# Remove (including volumes)
docker compose down back-office
```

## Environment Variables

### Build-Time Variables (Vite)

These variables are **embedded into the JavaScript bundle** during the Docker build process. They cannot be changed at runtime.

| Variable | Purpose | When to Set |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | Base URL for API calls | Build time |
| `VITE_PROFILING_URL` | Override profiling service URL | Build time |
| `VITE_CATALOGING_URL` | Override cataloging service URL | Build time |
| `VITE_ORDERING_URL` | Override ordering service URL | Build time |
| `VITE_PAYING_URL` | Override paying service URL | Build time |
| `VITE_SHIPPING_URL` | Override shipping service URL | Build time |

**To change these**: Rebuild the Docker image with `--build-arg`.

### Runtime Variables (Node.js)

These variables control the SvelteKit Node.js server and can be changed without rebuilding.

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Server port inside container |
| `HOST` | `0.0.0.0` | Server host (0.0.0.0 for Docker) |
| `NODE_ENV` | `production` | Node environment |

**To change these**: Use `-e` flag with `docker run` or update `docker-compose.yml`.

### Example: Different Environments

**Development** (pointing to local services):
```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost/api \
  -t back-office:dev .
```

**Production** (pointing to production API):
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.production.com \
  -t back-office:prod .
```

**Staging** (pointing to specific service IPs):
```bash
docker build \
  --build-arg VITE_PROFILING_URL=http://staging-profiling:9001 \
  --build-arg VITE_CATALOGING_URL=http://staging-cataloging:9002 \
  -t back-office:staging .
```

## Troubleshooting

### Issue: Build fails with "build directory not found"

**Symptom**:
```
ERROR: failed to solve: failed to compute cache key: "/app/build": not found
```

**Solution**: The Dockerfile uses `svelte.config.docker.js` which explicitly configures `@sveltejs/adapter-node`. Ensure:
1. `@sveltejs/adapter-node` is installed: `npm install --save-dev @sveltejs/adapter-node`
2. `svelte.config.docker.js` exists
3. Dockerfile copies this file before building

### Issue: Application doesn't respond on localhost:9010

**Symptom**: Container is running but no response on http://localhost:9010

**Checklist**:
1. Verify container is running: `docker ps | grep back-office`
2. Check logs: `docker logs back-office`
3. Verify port mapping: Should show `0.0.0.0:9010->3000/tcp`
4. Test inside container: `docker exec back-office wget -O- http://localhost:3000`
5. Check HOST env var is `0.0.0.0` (not `localhost` or `127.0.0.1`)

### Issue: API calls fail with CORS errors

**Symptom**: Browser console shows CORS policy errors

**Solution**:
- If using Traefik, ensure the back-office service URL in `traefik/dynamic.yml` points to the correct backend
- Verify `VITE_API_BASE_URL` is set correctly at build time
- Check that the API services are accessible from the back-office container

### Issue: Changes to code not reflected after rebuild

**Symptom**: Code changes don't appear after `docker compose up -d --build`

**Solution**:
```bash
# Force rebuild without cache
docker compose build --no-cache back-office
docker compose up -d back-office
```

### Issue: Image size is too large

**Symptom**: Docker image is >500MB

**Solution**: The multi-stage Dockerfile should produce ~150-200MB images. If larger:
1. Check `.dockerignore` is present and excludes `node_modules`
2. Verify multi-stage build is working (two stages: builder + production)
3. Use `docker images` to check actual size

### Issue: Health check failing

**Symptom**: Container shows "unhealthy" status

**Solution**:
```bash
# Check health check status
docker inspect back-office --format='{{json .State.Health}}'

# Manually test health check
docker exec back-office node -e "require('http').get('http://localhost:3000/', (r) => console.log(r.statusCode))"
```

If health check fails, ensure:
- Application is listening on `0.0.0.0:3000` (not `localhost:3000`)
- Build completed successfully (check `ls -la /app/build` inside container)

## Performance Tips

### Build Performance

1. **Use BuildKit** (enabled by default in Docker 23+):
   ```bash
   DOCKER_BUILDKIT=1 docker build -t back-office:latest .
   ```

2. **Layer Caching**: The Dockerfile is optimized for caching:
   - `package*.json` copied first (dependencies layer)
   - Source code copied separately (application layer)
   - Only rebuild affected layers on changes

3. **Multi-stage Benefits**:
   - Builder stage includes dev dependencies
   - Production stage only has runtime dependencies
   - Results in smaller final image (~150-200MB)

### Runtime Performance

1. **Resource Limits**:
   ```yaml
   back-office:
     deploy:
       resources:
         limits:
           cpus: '1'
           memory: 512M
         reservations:
           cpus: '0.5'
           memory: 256M
   ```

2. **Health Checks**: Already configured (30s interval, 3 retries)

3. **Logging**: Use JSON logging for production:
   ```yaml
   back-office:
     logging:
       driver: "json-file"
       options:
         max-size: "10m"
         max-file: "3"
   ```

## Security Considerations

### Production Checklist

- [ ] **Don't expose unnecessary ports**: Only expose 9010 if needed for direct access
- [ ] **Use secrets for sensitive data**: Don't hardcode credentials in build args
- [ ] **Run as non-root user**: Consider adding `USER node` to Dockerfile
- [ ] **Scan for vulnerabilities**: `docker scan back-office:latest`
- [ ] **Use specific base image versions**: `node:20.11-alpine` instead of `node:20-alpine`
- [ ] **Enable TLS**: Use HTTPS in production (configured via Traefik or reverse proxy)
- [ ] **Set NODE_ENV=production**: Already configured in Dockerfile
- [ ] **Minimize image layers**: Multi-stage build already optimized

### Environment Variables Security

**Never** include sensitive data in build args:
```bash
# BAD - credentials in build args
docker build --build-arg API_KEY=secret123 -t back-office .

# GOOD - use runtime secrets
docker run -e API_KEY_FILE=/run/secrets/api_key back-office
```

### Network Security

Use Docker networks to isolate containers:
```yaml
networks:
  e-commerce-network:
    driver: bridge
    internal: false  # Set to true if no external access needed
```

## Additional Resources

- **SvelteKit Adapter Node**: https://kit.svelte.dev/docs/adapter-node
- **Docker Multi-Stage Builds**: https://docs.docker.com/build/building/multi-stage/
- **Traefik Documentation**: https://doc.traefik.io/traefik/

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs: `docker logs back-office`
3. Verify Traefik configuration in `traefik/dynamic.yml`
4. Ensure microservices are running and accessible
