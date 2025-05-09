const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const BankDetail = sequelize.define('BankDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  AccountNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IFSC: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  BranchName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  AccountHolderName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = BankDetail;
