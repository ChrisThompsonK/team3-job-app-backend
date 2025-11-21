# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Accept build arguments for secrets
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET

# Set environment variables
ENV NODE_ENV=production PORT=3001

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY package*.json tsconfig.json drizzle.config.ts ./
COPY drizzle/ ./drizzle/
COPY src/ ./src/
COPY --from=builder /app/dist ./dist

# Create non-root user and set permissions
RUN mkdir -p /app/data && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Initialize database: push schema and seed data (must be before USER switch)
RUN npm run db:push && npm run seed

USER nodejs

EXPOSE ${PORT}

CMD ["node", "dist/server.js"]
