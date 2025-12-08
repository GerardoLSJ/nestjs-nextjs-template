# =============================================================================
# NestJS API Dockerfile for Azure Container Apps
# Multi-stage build for optimal image size and security
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig*.json ./

# Install all dependencies (including dev for build)
# Skip husky install in Docker
ENV HUSKY=0
RUN npm ci --ignore-scripts

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build the API application
RUN npx nx build api --prod

# -----------------------------------------------------------------------------
# Stage 3: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Install production dependencies only
# Skip husky and other prepare scripts in production
COPY package*.json ./
ENV HUSKY=0
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy Prisma schema and migrations for runtime
COPY --from=builder /app/apps/api/prisma ./prisma

# Generate Prisma client in production image
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy built application
COPY --from=builder /app/dist/apps/api ./dist

# Set ownership to non-root user
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose API port
EXPOSE 3333

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3333

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3333/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
