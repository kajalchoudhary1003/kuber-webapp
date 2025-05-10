const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/database.sqlite')
});

// Import all models
const models = {
  Currency: require('../models/currencyModel'),
  Role: require('../models/roleModel'),
  Level: require('../models/levelModel'),
  Organisation: require('../models/organisationModel'),
  CurrencyExchangeRate: require('../models/currencyExchangeRateModel'),
  Client: require('../models/clientModel'),
  Employee: require('../models/employeeModel'),
  ClientEmployee: require('../models/clientEmployeeModel'),
  BankDetail: require('../models/bankDetailModel'),
  Invoice: require('../models/invoiceModel'),
  Ledger: require('../models/ledgerModel'),
  PaymentTracker: require('../models/paymentTrackerModel'),
  ReconciliationNote: require('../models/reconciliationModel'),
  EmployeeCost: require('../models/employeeCostModel'),
  BillingDetail: require('../models/billingDetailModel'),
  FinancialYear: require('../models/financialYearModel')
};

// Define the order of seeding (respecting foreign key constraints)
const seedOrder = [
  'Currency',
  'Role',
  'Level',
  'Organisation',
  'CurrencyExchangeRate',
  'BankDetail',
  'Client',
  'Employee',
  'ClientEmployee',
  'FinancialYear',
  'EmployeeCost',
  'BillingDetail',
  'Invoice',
  'Ledger',
  'PaymentTracker',
  'ReconciliationNote'
];

async function createSeeder() {
  try {
    // Create the seeder file content
    let seederContent = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Disable foreign key checks temporarily
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    
    try {
`;

    // For each model in the seed order
    for (const modelName of seedOrder) {
      const model = models[modelName];
      const records = await model.findAll({ raw: true });
      
      if (records.length > 0) {
        // Add the bulk insert for this model
        seederContent += `
      // Seed ${modelName}
      await queryInterface.bulkInsert('${model.getTableName()}', ${JSON.stringify(records, null, 6)}, {});\n`;
      }
    }

    // Add the down migration
    seederContent += `
    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Disable foreign key checks temporarily
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    
    try {
`;

    // Add bulk deletes in reverse order
    for (const modelName of [...seedOrder].reverse()) {
      const model = models[modelName];
      seederContent += `
      // Remove ${modelName} data
      await queryInterface.bulkDelete('${model.getTableName()}', null, {});\n`;
    }

    seederContent += `
    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    }
  }
};`;

    // Create the seeder file
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const seederFileName = `${timestamp}-seed-all-tables.js`;
    const seederPath = path.join(__dirname, '../seeders', seederFileName);
    
    fs.writeFileSync(seederPath, seederContent);
    console.log(`Seeder file created at: ${seederPath}`);

  } catch (error) {
    console.error('Error creating seeder:', error);
  } finally {
    await sequelize.close();
  }
}

createSeeder(); 