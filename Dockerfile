# Multi-stage Dockerfile for OmniPortfolio Tracker with Host Volume Persistence

# --- STAGE 1: Dependency Layer Caching ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- STAGE 2: Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- STAGE 3: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=32000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy pre-compiled build artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create database folder with full read/write permissions for node user
RUN mkdir -p /app/db && chmod 777 /app/db && chown -R node:node /app

USER node

EXPOSE 32000

CMD ["node", "dist/server/index.js"]
