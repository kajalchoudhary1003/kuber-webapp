const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const backupRoutes = require('./routes/backupRoutes');
const bankDetailRoutes = require('./routes/bankDetailRoutes'); // Import the new routes for Bank Details
const billingRoutes = require('./routes/billingRoutes');
const clientBalanceRoutes = require('./routes/clientBalanceRoutes');
const clientRoutes = require('./routes/clientRoutes');
const clientEmployeeRoutes = require('./routes/clientEmployeeRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const currencyExchangeRateRoutes = require('./routes/currencyExchangeRateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeCostRoutes = require('./routes/employeeCostRoutes');
const financialYearRoutes = require('./routes/financialYearRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');
const levelRoutes = require('./routes/levelRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const paymentTrackerRoutes = require('./routes/paymentTrackerRoutes');
const profitabilityRoutes = require('./routes/profitabilityRoutes');
const roleRoutes = require('./routes/roleRoutes');



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/backup', backupRoutes); // 👈 This is your backup route
app.use('/api/bank-details', bankDetailRoutes); // 👈 This is the new route for Bank Details
app.use('/api/billing', billingRoutes);
app.use('/api/client-balance', clientBalanceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/client-employees', clientEmployeeRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/exchange-rates', currencyExchangeRateRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-cost', employeeCostRoutes);
app.use('/api/financial-years', financialYearRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api', paymentTrackerRoutes);
app.use('/api/profitability', profitabilityRoutes);
app.use('/api/roles', roleRoutes); 




module.exports = app;
