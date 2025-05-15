#!/bin/bash

# Function to open a new Terminal tab and run a command
open_new_tab() {
  osascript <<EOF
tell application "Terminal"
    activate
    do script "$1"
end tell
EOF
}

echo "🚀 Installing backend dependencies..."
cd backend
npm install

echo "🟢 Starting backend in new tab..."
open_new_tab "cd $(pwd) && npm run dev"

cd ../frontend

echo "🚀 Installing frontend dependencies..."
npm install

echo "🟢 Starting frontend (React Vite) in new tab..."
open_new_tab "cd $(pwd) && npm run dev"

echo "✅ Project is running. Open your browser at http://localhost:5173"

