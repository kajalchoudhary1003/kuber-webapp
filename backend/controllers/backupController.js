const backupService = require('../services/backupService');
const logger = require('../utils/logger');

// POST /api/backup
exports.backupDatabase = async (req, res) => {
  try {
    const result = await backupService.backupDatabase();
    if (result.success) {
      // Set headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${result.fileName}`);
      res.send(result.data);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    logger.error('Error during database backup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/restore
exports.restoreDatabase = async (req, res) => {
  try {
    if (!req.body || !req.body.backupData) {
      return res.status(400).json({ success: false, message: 'No backup data provided' });
    }
    const result = await backupService.restoreDatabase(req.body.backupData);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error during database restore:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
