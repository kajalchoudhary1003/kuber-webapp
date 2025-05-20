# Kuber Webapp

A web application with React frontend and Node.js backend, containerized with Docker.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Docker (for production deployment)

## Project Structure

```
kuber-webapp/
├── frontend/          # React frontend application
├── backend/           # Node.js backend application
├── Dockerfile         # Docker configuration
├── nginx.conf         # Nginx server configuration
└── .dockerignore      # Docker ignore rules
```

## Development Setup

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will be available at http://localhost:5001

## Production Setup (Docker)

### Building the Docker Image

```bash
# From the root directory
docker build -t kuber-webapp .
```

### Running the Container

```bash
docker run -p 80:80 -p 5001:5001 kuber-webapp
```


The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5001

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin feature/your-feature-name
   ```

4. Create a pull request to merge into the dev branch

## Notes

- The frontend is built using Vite and React
- The backend is built using Express.js
- Nginx is used as a reverse proxy in production
- The application uses SQLite as the database

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed in both frontend and backend
2. Check if the required ports (5173, 5001) are available
3. For Docker issues, ensure Docker is running and ports 80 and 5001 are not in use



## At Client's side : 

Follow these steps:

https://docs.google.com/document/d/10YaBVv6-7FwtVOaorXF7maU-rxtVcm6fRQzp440L38s/edit?tab=t.0