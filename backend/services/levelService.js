const { Op } = require('sequelize');
const Level = require('../models/levelModel');
const Employee = require('../models/employeeModel');

const levelService = {
  async getAllLevels() {
    try {
      const levels = await Level.findAll({
        order: [['LevelNumber', 'ASC']]
      });
      return levels;
    } catch (error) {
      throw new Error('Error fetching levels: ' + error.message);
    }
  },

  async getLevelById(id) {
    try {
      const level = await Level.findByPk(id);
      if (!level) {
        throw new Error('Level not found');
      }
      return level;
    } catch (error) {
      throw new Error('Error fetching level: ' + error.message);
    }
  },

  async createLevel(levelData) {
    try {
      // Check for existing level number
      const existingLevel = await Level.findOne({
        where: { LevelNumber: levelData.LevelNumber }
      });

      if (existingLevel) {
        throw new Error('Level number already exists');
      }

      const level = await Level.create(levelData);
      return level;
    } catch (error) {
      throw new Error('Error creating level: ' + error.message);
    }
  },

  async updateLevel(id, levelData) {
    try {
      const level = await Level.findByPk(id);
      if (!level) {
        throw new Error('Level not found');
      }

      // Check for duplicate level number if it's being changed
      if (levelData.LevelNumber && levelData.LevelNumber !== level.LevelNumber) {
        const existingLevel = await Level.findOne({
          where: {
            LevelNumber: levelData.LevelNumber,
            id: { [Op.ne]: id }
          }
        });

        if (existingLevel) {
          throw new Error('Level number already exists');
        }
      }

      await level.update(levelData);
      return level;
    } catch (error) {
      throw new Error('Error updating level: ' + error.message);
    }
  },

  async deleteLevel(id) {
    try {
      const level = await Level.findByPk(id);
      if (!level) {
        throw new Error('Level not found');
      }

      // Check if level is in use by any employees
      const employeesWithLevel = await Employee.findOne({
        where: { LevelID: id }
      });

      if (employeesWithLevel) {
        throw new Error('Cannot delete level as it is assigned to one or more employees');
      }

      await level.destroy();
      return { message: 'Level deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting level: ' + error.message);
    }
  },

  async searchLevels(query) {
    try {
      const levels = await Level.findAll({
        where: {
          [Op.or]: [
            { LevelName: { [Op.like]: `%${query}%` } },
            { Description: { [Op.like]: `%${query}%` } }
          ]
        },
        order: [['LevelNumber', 'ASC']]
      });
      return levels;
    } catch (error) {
      throw new Error('Error searching levels: ' + error.message);
    }
  },

  async getLevelEmployees(id) {
    try {
      const level = await Level.findByPk(id, {
        include: [{ model: Employee, as: 'Employees' }]
      });
      if (!level) {
        throw new Error('Level not found');
      }
      return level.Employees;
    } catch (error) {
      throw new Error('Error fetching level employees: ' + error.message);
    }
  }
};

module.exports = levelService;
