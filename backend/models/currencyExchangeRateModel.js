const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Adjust the path as necessary

const CurrencyExchangeRate = sequelize.define('CurrencyExchangeRate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CurrencyFromID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CurrencyToID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ExchangeRate: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  Year: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }
});

module.exports = CurrencyExchangeRate;
