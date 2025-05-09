const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Function to generate a timestamp for backup naming
const getFormattedTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}`;
};

const backupDatabase = async () => {
  try {
    // Use the database path from your configuration
    const dbPath = path.join(__dirname, '../database/database.sqlite');
    const backupDir = path.join(__dirname, '../backups');

    if (!fs.existsSync(dbPath)) {
      logger.error('Database file does not exist.');
      return { success: false, message: 'Database file does not exist.' };
    }

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = getFormattedTimestamp();
    const backupPath = path.join(backupDir, `kuber_${timestamp}.db`);

    fs.copyFileSync(dbPath, backupPath);
    logger.info('Database backup created successfully.');
    return { 
      success: true, 
      message: 'Database backup created successfully.',
      backupPath: backupPath
    };
  } catch (err) {
    logger.error(`Error during database backup: ${err.message}`);
    return { success: false, message: `Error during database backup: ${err.message}` };
  }
};

const restoreDatabase = async (backupFile) => {
  try {
    if (!backupFile) {
      return { success: false, message: 'No backup file provided' };
    }

    const dbPath = path.join(__dirname, '../database/database.sqlite');

    // Create database directory if it doesn't exist
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Move the uploaded file to the database location
    fs.copyFileSync(backupFile.tempFilePath, dbPath);
    fs.chmodSync(dbPath, 0o666);
    
    logger.info('Database restored successfully.');
    return { success: true, message: 'Database restored successfully.' };
  } catch (err) {
    logger.error(`Error during database restore: ${err.message}`);
    return { success: false, message: `Error during database restore: ${err.message}` };
  }
};

module.exports = { backupDatabase, restoreDatabase };
