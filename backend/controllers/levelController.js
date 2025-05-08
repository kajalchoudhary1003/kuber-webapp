const levelService = require('../services/levelService');
const logger = require('../utils/logger');

const createLevel = async (req, res) => {
  try {
    logger.info('Create level service called');
    const level = await levelService.createLevel(req.body);
    res.status(201).json(level);
  } catch (error) {
    logger.error(`Error creating level: ${error.message}`);
    res.status(500).json({ error: 'Error creating level' });
  }
};

const getAllLevels = async (req, res) => {
  try {
    logger.info('Get all levels service called');
    const levels = await levelService.getAllLevels();
    res.status(200).json(levels);
  } catch (error) {
    logger.error(`Error fetching levels: ${error.message}`);
    res.status(500).json({ error: 'Error fetching levels' });
  }
};

const updateLevel = async (req, res) => {
  const { levelId } = req.params;
  const updates = req.body;

  try {
    logger.info(`Update level service called for levelId: ${levelId}`);
    const updatedLevel = await levelService.updateLevel(levelId, updates);
    res.status(200).json(updatedLevel);
  } catch (error) {
    logger.error(`Error updating level: ${error.message}`);
    res.status(500).json({ error: 'Error updating level' });
  }
};

const deleteLevel = async (req, res) => {
  const { levelId } = req.params;

  try {
    logger.info(`Delete level service called for levelId: ${levelId}`);
    const result = await levelService.deleteLevel(levelId);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting level: ${error.message}`);
    res.status(500).json({ error: 'Error deleting level' });
  }
};

module.exports = {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
};
