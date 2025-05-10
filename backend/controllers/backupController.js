const { backupDatabase, restoreDatabase } = require('../services/backupService');
const logger = require('../utils/logger');

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

// POST /api/restore
exports.restoreDatabase = async (req, res) => {
  try {
    if (!req.files || !req.files.backupFile) {
      logger.error('No backup file uploaded.');
      return res.status(400).json({ success: false, message: 'No backup file uploaded' });
    }

    const result = await restoreDatabase(req.files.backupFile);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    logger.error('Error during database restore:', { error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message });
  }
};