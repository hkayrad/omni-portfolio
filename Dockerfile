# Multi-stage Dockerfile for OmniPortfolio Tracker

# --- STAGE 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build Vite client SPA & Express TypeScript server
RUN npm run build

# --- STAGE 2: Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=32000

# Copy package descriptors & install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled build artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create database folder for persistence
RUN mkdir -p /app/db && chown -R node:node /app

USER node

EXPOSE 32000

# Volume mount point for persistent SQLite / JSON file database
VOLUME ["/app/db"]

CMD ["node", "dist/server/index.js"]
