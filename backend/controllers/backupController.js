const { backupDatabase, restoreDatabase } = require('../services/backupService');
const logger = require('../utils/logger');

// POST /api/backup
exports.backupDatabase = async (req, res) => {
  try {
    const result = await backupDatabase();
    res.json(result);
  } catch (error) {
    logger.error('Error during database backup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/restore
exports.restoreDatabase = async (req, res) => {
  try {
    if (!req.files || !req.files.backupFile) {
      return res.status(400).json({ success: false, message: 'No backup file uploaded' });
    }

    const result = await restoreDatabase(req.files.backupFile);
    res.json(result);
  } catch (error) {
    logger.error('Error during database restore:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
