# ─── Stage 1: Build ──────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies needed for native modules & PostGIS tooling
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# Prune dev dependencies for production runtime
RUN npm prune --production

# ─── Stage 2: Production Runtime ─────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Security: non-root user
USER node

# Copy built application and production dependencies
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start STRATA backend engine
CMD ["node", "dist/server.js"]
