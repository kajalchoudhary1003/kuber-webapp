const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

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
    const collections = await mongoose.connection.db.collections();
    const backupData = {};

    for (const collection of collections) {
      const name = collection.collectionName;
      const data = await collection.find({}).toArray();
      backupData[name] = data;
    }

    const timestamp = getFormattedTimestamp();
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const filePath = path.join(backupDir, `mongo_backup_${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    logger.info('MongoDB backup created successfully.');
    return { success: true, message: 'MongoDB backup created successfully.', filePath };
  } catch (err) {
    logger.error(`Error during MongoDB backup: ${err.message}`);
    return { success: false, message: `Error during MongoDB backup: ${err.message}` };
  }
};

const restoreDatabase = async () => {
  try {
    const latestBackupFile = getLatestBackupFile();
    if (!latestBackupFile) {
      return { success: false, message: 'No backup file found.' };
    }

    const backupJson = fs.readFileSync(latestBackupFile, 'utf-8');
    const backupData = JSON.parse(backupJson);

    for (const collectionName in backupData) {
      const collection = mongoose.connection.db.collection(collectionName);
      await collection.deleteMany({}); // Clear existing
      if (backupData[collectionName].length > 0) {
        await collection.insertMany(backupData[collectionName]);
      }
    }

    logger.info('MongoDB restore completed successfully.');
    return { success: true, message: 'MongoDB restore completed successfully.' };
  } catch (err) {
    logger.error(`Error during MongoDB restore: ${err.message}`);
    return { success: false, message: `Error during MongoDB restore: ${err.message}` };
  }
};

const getLatestBackupFile = () => {
  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) return null;

  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('mongo_backup_') && f.endsWith('.json'))
    .sort()
    .reverse();

  return files.length > 0 ? path.join(backupDir, files[0]) : null;
};

module.exports = { backupDatabase, restoreDatabase };
