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


module.exports = app;
