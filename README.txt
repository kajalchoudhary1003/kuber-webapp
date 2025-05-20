==============================
Kuber Web App - Simple Setup Guide
==============================

This guide will help you run the Kuber Web App on your computer using Docker Desktop. No technical skills needed!

1. Prerequisites:
   - Install Docker Desktop from: https://www.docker.com/products/docker-desktop/
   - Make sure Docker Desktop is running (open the app, wait for it to say "Running")

2. Get the Project Files:
   - You will receive a ZIP file with the project.
   - Download and unzip (extract) the file to a folder on your computer.
   - IMPORTANT: You do NOT need any 'node_modules' folders. If you see them, you can delete them.

3. Start the Project (Easiest Way):
   - Open the folder where you unzipped the project.
   - Find the file named 'docker-compose.yml'.
   - Right-click inside the folder (not on a file) and choose:
     - On Mac: "Open in Terminal"
     - On Windows: "Open in Command Prompt" or "Open PowerShell window here"
   - In the window that opens, type this command and press Enter:
     docker compose up --build
   - Wait a few minutes. The app is ready when you see messages that all services are running.

4. Open the App:
   - Open your web browser and go to: http://localhost
   - You should see the Kuber Web App!

5. Stopping the App:
   - Go back to the terminal window and press Ctrl + C on your keyboard.
   - Then type:
     docker compose down
   - Press Enter.

6. Data is Saved!
   - All your data is saved in the 'data/database' folder inside the project.
   - When you stop and start the app again (even after days), your data will still be there.

7. Need Help?
   - If you have any trouble, just ask! Screenshots or a quick call can help.

---

**Summary:**
- Unzip the project
- Open the folder in Terminal/Command Prompt
- Run: docker compose up --build
- Go to http://localhost in your browser
- Your data is always saved! 