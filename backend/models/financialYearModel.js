const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const FinancialYear = sequelize.define('FinancialYear', {
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
});

module.exports = FinancialYear;
