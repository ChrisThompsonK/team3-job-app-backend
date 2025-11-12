# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Define the start command
CMD ["npm", "start"]
