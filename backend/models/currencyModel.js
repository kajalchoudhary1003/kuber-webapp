// models/currencyModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Currency = sequelize.define('Currency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Symbol: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Currency;
