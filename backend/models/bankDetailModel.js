const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const BankDetail = sequelize.define('BankDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AccountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SwiftCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IfscCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = BankDetail;
