Kuber Webapp Documentation


For a user-friendly guide to run the application, please visit:
https://docs.google.com/document/d/1w3_NAQqTxGEWAgMgYDeZWdACGIgdLIdYFw8yV8dsUp0/edit?tab=t.0

Project Structure:
-----------------
kuber-webapp/
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   ├── public/           # Static files
│   ├── package.json      # Frontend dependencies
│   ├── package-lock.json # Locked dependencies
│   ├── Dockerfile        # Frontend container configuration
│   ├── vite.config.js    # Vite configuration
│   ├── jsconfig.json     # JavaScript configuration
│   ├── components.json   # UI components configuration
│   ├── eslint.config.js  # ESLint configuration
│   └── index.html        # Entry HTML file
│
├── backend/              # Node.js backend application
│   ├── src/             # Source code
│   ├── package.json     # Backend dependencies
│   ├── package-lock.json # Locked dependencies
│   └── Dockerfile       # Backend container configuration
│
├── data/                # Data directory
│   └── database/        # SQLite database location (empty folder)
│
├── docker-compose.yml   # Docker services configuration
├── README.md           # Project documentation
├── .dockerignore       # Docker ignore rules
└── .gitignore         # Git ignore rules

Setup Instructions:
------------------
1. Prerequisites:
   - Docker and Docker Compose installed
   - Node.js (for local development)

2. Running with Docker:
   - Navigate to project root
   - Run: docker-compose up --build
   - Frontend will be available at: http://localhost:3000
   - Backend API will be available at: http://localhost:5001

3. Local Development:
   Frontend:
   - cd frontend
   - npm install
   - npm run dev
   - Access at: http://localhost:5173

   Backend:
   - cd backend
   - npm install
   - npm start
   - API available at: http://localhost:5001

4. Database:
   - SQLite database is stored in data/database/
   - Database file is created automatically on first run
   - Data persists through Docker volumes

5. Environment Variables:
   Backend:
   - NODE_ENV=production
   - PORT=5001
   - DB_PATH=/app/database/database.sqlite

Notes:
------
- Frontend uses Vite for development and building
- Backend uses Express.js with SQLite
- Docker services are configured with resource limits
- CORS is configured for local development
- Database is persisted using Docker volumes

For more detailed information, please refer to the README.md file.
