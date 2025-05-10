const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Role = require('./roleModel');
const Level = require('./levelModel');
const Organisation = require('./organisationModel');
const ClientEmployee = require('./clientEmployeeModel');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  EmpCode: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
  },
  RoleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LevelID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  OrganisationID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CTCAnnual: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  CTCMonthly: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  ContactNumber: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Active',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true
});

module.exports = Employee;
