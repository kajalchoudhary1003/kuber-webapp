const Level = require('../models/levelModel');
const logger = require('../utils/logger');

const createLevel = async (levelData) => {
  try {
    const level = await Level.create(levelData);
    return level;
  } catch (error) {
    logger.error(`Error creating level: ${error.message}`);
    throw new Error(`Error creating level: ${error.message}`);
  }
};

const getAllLevels = async () => {
  try {
    const levels = await Level.find({});
    return levels;
  } catch (error) {
    logger.error(`Error fetching levels: ${error.message}`);
    throw new Error(`Error fetching levels: ${error.message}`);
  }
};

const updateLevel = async (levelId, updates) => {
  try {
    const level = await Level.findById(levelId);
    if (!level) {
      throw new Error(`Level with id ${levelId} not found`);
    }
    Object.assign(level, updates);
    const updatedLevel = await level.save();
    return updatedLevel;
  } catch (error) {
    logger.error(`Error updating level: ${error.message}`);
    throw new Error(`Error updating level: ${error.message}`);
  }
};

const deleteLevel = async (levelId) => {
  try {
    const level = await Level.findById(levelId);
    if (!level) {
      throw new Error(`Level with id ${levelId} not found`);
    }
    await Level.deleteOne({ _id: levelId });
    return { message: 'Level deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting level: ${error.message}`);
    throw new Error(`Error deleting level: ${error.message}`);
  }
};

module.exports = {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
};
