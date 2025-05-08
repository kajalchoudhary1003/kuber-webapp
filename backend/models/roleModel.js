const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Adjust the path as necessary

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RoleName: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});

module.exports = Role;
