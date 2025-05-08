const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Adjust the path as necessary

const Level = sequelize.define('Level', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  LevelName: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

module.exports = Level;
