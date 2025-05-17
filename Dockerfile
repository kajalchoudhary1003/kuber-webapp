# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev
RUN npm install
COPY backend/ .

# Final image
FROM node:18-alpine

# Install nginx and sqlite build dependencies
RUN apk add --no-cache nginx sqlite-dev python3 make g++ supervisor

# Copy frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend
COPY --from=backend-builder /app/backend /backend

# Rebuild sqlite3 for the current platform
WORKDIR /backend
RUN npm rebuild sqlite3

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create supervisor config
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "[program:backend]" >> /etc/supervisord.conf && \
    echo "command=node server.js" >> /etc/supervisord.conf && \
    echo "directory=/backend" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf

# Expose ports
EXPOSE 80 5001

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
