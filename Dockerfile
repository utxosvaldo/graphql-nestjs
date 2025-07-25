# Use Node.js 22.17.0 as base image
FROM node:22.17.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
