// models/invoiceModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Client = require('./clientModel');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ClientID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id',
    },
  },
  Year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  OrganisationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  BankDetailID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PdfPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  InvoicedOn: {
    type: DataTypes.DATE,
    allowNull: true, // or false, depending on your requirement
  },
  GeneratedOn: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
},);

Invoice.belongsTo(Client, { foreignKey: 'ClientID' });

module.exports = Invoice;
