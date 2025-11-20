FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Prune devDependencies for production
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production PORT=3001

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY drizzle.config.ts ./
COPY package*.json ./

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE ${PORT}

# Run database setup (migrations + seeds) before starting the server
CMD ["sh", "-c", "node dist/scripts/setupDatabase.js && node dist/server.js"]

