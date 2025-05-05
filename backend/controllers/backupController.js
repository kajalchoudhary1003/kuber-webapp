const backupService = require('../services/backupService');
const logger = require('../utils/logger');

// POST /api/backup
exports.backupDatabase = async (req, res) => {
  try {
    const result = await backupService.backupDatabase();
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error during database backup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/restore
exports.restoreDatabase = async (req, res) => {
  try {
    const result = await backupService.restoreDatabase();
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error during database restore:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
