const Currency = require('./currencyModel');
const Role = require('./roleModel');
const Level = require('./levelModel');
const Organisation = require('./organisationModel');
const CurrencyExchangeRate = require('./currencyExchangeRateModel');
const Client = require('./clientModel');
const Employee = require('./employeeModel');
const ClientEmployee = require('./clientEmployeeModel');
const BankDetail = require('./bankDetailModel');
const Invoice = require('./invoiceModel');
const Ledger = require('./ledgerModel');
const PaymentTracker = require('./paymentTrackerModel');
const ReconciliationNote = require('./reconciliationModel');

// Currency Exchange Rate Associations
CurrencyExchangeRate.belongsTo(Currency, { as: 'CurrencyFrom', foreignKey: 'CurrencyFromID' });
CurrencyExchangeRate.belongsTo(Currency, { as: 'CurrencyTo', foreignKey: 'CurrencyToID' });

// Client Associations
Client.belongsTo(Currency, { as: 'BillingCurrency', foreignKey: 'BillingCurrencyID' });
Client.belongsTo(Organisation, { as: 'Organisation', foreignKey: 'OrganisationID' });
Client.belongsTo(BankDetail, { as: 'BankDetail', foreignKey: 'BankDetailID' });
Client.hasMany(ClientEmployee, { foreignKey: 'ClientID' });
Client.hasMany(Invoice, { foreignKey: 'ClientID' });
Client.hasMany(Ledger, { foreignKey: 'ClientID' });
Client.hasMany(PaymentTracker, { foreignKey: 'ClientID' });

// Employee Associations
Employee.belongsTo(Role, { foreignKey: 'RoleID' });
Employee.belongsTo(Level, { foreignKey: 'LevelID' });
Employee.belongsTo(Organisation, { foreignKey: 'OrganisationID' });
Employee.hasMany(ClientEmployee, { foreignKey: 'EmployeeID' });

// ClientEmployee Associations
ClientEmployee.belongsTo(Employee, { foreignKey: 'EmployeeID' });
ClientEmployee.belongsTo(Client, { foreignKey: 'ClientID' });

// Invoice Associations
Invoice.belongsTo(Client, { foreignKey: 'ClientID' });

// Ledger Associations
Ledger.belongsTo(Client, { foreignKey: 'ClientID' });

// PaymentTracker Associations
PaymentTracker.belongsTo(Client, { foreignKey: 'ClientID' });

module.exports = {
  Currency,
  Role,
  Level,
  Organisation,
  CurrencyExchangeRate,
  Client,
  Employee,
  ClientEmployee,
  BankDetail,
  Invoice,
  Ledger,
  PaymentTracker,
  ReconciliationNote,
}; 