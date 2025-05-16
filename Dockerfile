# Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Final image
FROM nginx:alpine
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY --from=backend-builder /app/backend /usr/share/nginx/html/backend
COPY nginx.conf /etc/nginx/nginx.conf

# Install Node.js in the final image for running the backend
RUN apk add --update nodejs npm

# Start both backend and nginx
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"] 