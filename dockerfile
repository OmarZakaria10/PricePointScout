# Use specific version for reliability (not 'latest')
# Pin version to prevent unexpected breaking changes
FROM ghcr.io/puppeteer/puppeteer:23.1.0

# Set working directory
WORKDIR /app

# Set environment variables for optimal performance
ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copy package files first (for better Docker layer caching)
# If package.json doesn't change, Docker reuses the npm install layer
COPY --chown=pptruser:pptruser package*.json ./

# Install only production dependencies with optimizations
# --only=production: excludes devDependencies (testing/dev tools)
# --prefer-offline: uses cache when possible (faster)
# --no-audit: skips security audit during install (faster, run separately)
# --progress=false: less output (faster CI builds)
RUN npm ci --only=production --prefer-offline --no-audit --progress=false && \
    npm cache clean --force

# Copy application code (after npm install for better caching)
# .dockerignore prevents copying: tests, docs, terraform, ansible, etc.
COPY --chown=pptruser:pptruser . .

# Switch to non-root user for security (prevents privilege escalation)
USER pptruser

# Health check for container orchestration (Kubernetes, Docker Swarm)
# Allows orchestrator to detect if container is unhealthy and restart it
# -f flag makes curl fail on HTTP errors (4xx, 5xx)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose the port your app listens on
EXPOSE 8080

# Start application directly with node (not npm start)
# Faster startup, better signal handling (SIGTERM/SIGINT), less memory overhead
CMD ["node", "index.js"]
