const { backupDatabase, restoreDatabase } = require('../services/backupService');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

// POST /api/backup
exports.backupDatabase = async (req, res) => {
  try {
    const result = await backupDatabase();
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Error during database backup:', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const filename = req.params.filename;
    const backupDir = path.join(__dirname, '../backups');
    const filePath = path.join(backupDir, filename);

    if (!fs.existsSync(filePath)) {
      logger.error('Backup file does not exist.', { filePath });
      return res.status(404).json({ success: false, message: 'Backup file does not exist.' });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        logger.error('Error downloading backup file:', { error: err.message, stack: err.stack });
        res.status(500).json({ success: false, message: 'Error downloading backup file.' });
      }
    });
  } catch (error) {
    logger.error('Error during backup download:', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/restore
exports.restoreDatabase = async (req, res) => {
  try {
    // Check if we have a file upload
    if (req.files && req.files.backupFile) {
      const backupFile = req.files.backupFile;
      const result = await restoreDatabase(backupFile);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    }
    
    // Check if we have a filename in the request body
    if (req.body && req.body.backupName) {
      const result = await restoreDatabase(req.body.backupName);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    }
    
    // If we get here, we have neither a file nor a filename
    logger.error('No backup file or backup name provided.');
    return res.status(400).json({ 
      success: false, 
      message: 'Please either upload a backup file or provide a backup filename' 
    });
    
  } catch (error) {
    logger.error('Error during database restore:', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};