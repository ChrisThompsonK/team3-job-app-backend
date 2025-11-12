# Use Node.js 20 Alpine as base image for smaller size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force
# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Production stage
FROM base AS production

# Set working directory
WORKDIR /app

# Copy production dependencies from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy built output from build stage
COPY --from=build /app/dist ./dist

# Copy package.json (if needed at runtime)
COPY package*.json ./

# Set environment variables for production
ENV NODE_ENV=production \
    PORT=3001
# Expose the port the app runs on
EXPOSE 3001

# Define the start command
CMD ["npm", "start"]
