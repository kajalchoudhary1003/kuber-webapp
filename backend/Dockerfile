# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++ sqlite sqlite-dev

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Rebuild sqlite3 for the current platform
RUN npm rebuild sqlite3

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache sqlite

# Copy built application from builder stage
COPY --from=builder /app .

# Expose the backend port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"] 