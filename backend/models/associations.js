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
const EmployeeCost = require('./employeeCostModel');
const BillingDetail = require('./billingDetailModel');
const FinancialYear = require('./financialYearModel');

// ==================== Currency & Exchange Rate Associations ====================
CurrencyExchangeRate.belongsTo(Currency, { as: 'CurrencyFrom', foreignKey: 'CurrencyFromID' });
CurrencyExchangeRate.belongsTo(Currency, { as: 'CurrencyTo', foreignKey: 'CurrencyToID' });

// ==================== Client Associations ====================
Client.belongsTo(Currency, { as: 'BillingCurrency', foreignKey: 'BillingCurrencyID' });
Client.belongsTo(Organisation, { as: 'Organisation', foreignKey: 'OrganisationID' });
Client.belongsTo(BankDetail, { as: 'BankDetail', foreignKey: 'BankDetailID' });
Client.hasMany(ClientEmployee, { foreignKey: 'ClientID' });
Client.hasMany(Invoice, { foreignKey: 'ClientID' });
Client.hasMany(Ledger, { foreignKey: 'ClientID' });
Client.hasMany(PaymentTracker, { foreignKey: 'ClientID' });
Client.hasMany(BillingDetail, { foreignKey: 'ClientID' });

// ==================== Employee Associations ====================
Employee.belongsTo(Role, { foreignKey: 'RoleID' });
Employee.belongsTo(Level, { foreignKey: 'LevelID' });
Employee.belongsTo(Organisation, { foreignKey: 'OrganisationID' });
Employee.hasMany(ClientEmployee, { foreignKey: 'EmployeeID' });
Employee.hasMany(EmployeeCost, { foreignKey: 'EmployeeID' });
Employee.hasMany(BillingDetail, { foreignKey: 'EmployeeID' });

// ==================== ClientEmployee Associations ====================
ClientEmployee.belongsTo(Employee, { foreignKey: 'EmployeeID' });
ClientEmployee.belongsTo(Client, { foreignKey: 'ClientID' });

// ==================== Invoice Associations ====================
Invoice.belongsTo(Client, { foreignKey: 'ClientID' });
Invoice.belongsTo(Currency, { foreignKey: 'BillingCurrencyID', as: 'Currency' });
Invoice.belongsTo(Organisation, { foreignKey: 'OrganisationID' });
Invoice.belongsTo(BankDetail, { foreignKey: 'BankDetailID' });

// ==================== Ledger Associations ====================
Ledger.belongsTo(Client, { foreignKey: 'ClientID' });

// ==================== PaymentTracker Associations ====================
PaymentTracker.belongsTo(Client, { foreignKey: 'ClientID' });

// ==================== EmployeeCost Associations ====================
EmployeeCost.belongsTo(Employee, { foreignKey: 'EmployeeID' });
EmployeeCost.belongsTo(FinancialYear, { foreignKey: 'FinancialYearID' });

// ==================== BillingDetail Associations ====================
BillingDetail.belongsTo(Client, { foreignKey: 'ClientID' });
BillingDetail.belongsTo(Employee, { foreignKey: 'EmployeeID' });

// Export all models
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
  EmployeeCost,
  BillingDetail,
  FinancialYear
}; 
