const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connectDB');
const Currency = require('./currencyModel');

const CurrencyExchangeRate = sequelize.define('CurrencyExchangeRate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CurrencyFromID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Currency,
      key: 'id',
    },
  },
  CurrencyToID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Currency,
      key: 'id',
    },
  },
  Rate: {
    type: DataTypes.DECIMAL(18, 6),
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = CurrencyExchangeRate;
