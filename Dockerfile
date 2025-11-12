# Use Node.js 20 Alpine as base image for smaller size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Production stage
FROM base AS production

# Set working directory
WORKDIR /app

# Copy installed dependencies from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Set environment variables for production
ENV NODE_ENV=production \
    PORT=3001

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Define the start command
CMD ["npm", "start"]
