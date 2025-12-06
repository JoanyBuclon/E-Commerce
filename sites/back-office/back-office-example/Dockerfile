# =============================================================================
# Stage 1: Builder - Build the SvelteKit application
# =============================================================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build arguments for Vite environment variables
# These can be overridden at build time with --build-arg
ARG VITE_API_BASE_URL=http://localhost/api
ARG VITE_PROFILING_URL
ARG VITE_CATALOGING_URL
ARG VITE_ORDERING_URL
ARG VITE_PAYING_URL
ARG VITE_SHIPPING_URL

# Set environment variables for the build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_PROFILING_URL=${VITE_PROFILING_URL}
ENV VITE_CATALOGING_URL=${VITE_CATALOGING_URL}
ENV VITE_ORDERING_URL=${VITE_ORDERING_URL}
ENV VITE_PAYING_URL=${VITE_PAYING_URL}
ENV VITE_SHIPPING_URL=${VITE_SHIPPING_URL}

# Use Docker-specific config that explicitly uses adapter-node
RUN cp svelte.config.docker.js svelte.config.js

# Build the application
RUN npm run build

# Debug: List build output to verify (can be removed in production)
RUN echo "Build completed. Checking output..." && ls -la build/ && echo "Build directory contents OK!"

# =============================================================================
# Stage 2: Production - Run the built application
# =============================================================================
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Since all deps are in devDependencies, we need to install them for the built output to work
RUN npm ci --omit=dev || npm ci

# Copy the built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Copy .env file if it exists (optional, can be overridden by environment variables)
COPY --from=builder /app/.env* ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "build"]
