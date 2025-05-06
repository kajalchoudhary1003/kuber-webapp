const BillingSetup = require('../models/BillingSetup');
const CurrencyExchangeRate = require('../models/CurrencyExchangeRate');
const Currency = require('../models/Currency');
const Client = require('../models/Client');
const Employee = require('../models/Employee');
const EmployeeCost = require('../models/EmployeeCost');
const logger = require('../utils/logger');

const getProfitabilityReport = async (clientId, financialYear) => {
  try {
    // Fetch client data
    const client = await Client.findById(clientId);
    if (!client) throw new Error('Client not found.');

    const billingCurrency = client.billingCurrency;
    const inrCurrency = await Currency.findOne({ CurrencyName: 'INR' });
    if (!inrCurrency) throw new Error('INR currency not found.');

    const inrCurrencyId = inrCurrency.id;
    logger.info(`INR currency ID: ${inrCurrencyId}`);

    // Fetch billing data for the selected client and financial year
    const billingData = await BillingSetup.find({
      clientId: clientId,
      financialYear: financialYear,
    });
    if (!billingData.length) throw new Error('No billing data found for the selected client and financial year.');

    // Fetch exchange rate
    const exchangeRate = await CurrencyExchangeRate.findOne({
      currencyFrom: billingCurrency,
      currencyTo: inrCurrencyId,
      financialYear: financialYear,
    });
    if (!exchangeRate) throw new Error('No exchange rate found for the billing currency.');

    // Calculate billing amounts in INR for each month
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const billingAmountsInINR = {};

    months.forEach(month => {
      billingAmountsInINR[month] = billingData.reduce((total, billing) => total + billing[month] * exchangeRate.exchangeRate, 0);
    });

    // Calculate total salaries in INR for each month considering the number of clients
    const totalSalariesInINR = {};
    const employeeClientCounts = {};

    months.forEach(month => {
      totalSalariesInINR[month] = 0;
    });

    for (const billing of billingData) {
      const salaryRecord = await EmployeeCost.findOne({
        employeeId: billing.employeeId,
        financialYear: financialYear,
      });
      if (!salaryRecord) throw new Error(`No salary record found for employee ID ${billing.employeeId}.`);

      if (!employeeClientCounts[billing.employeeId]) {
        employeeClientCounts[billing.employeeId] = {};
        for (const month of months) {
          const clientCount = await BillingSetup.count({
            employeeId: billing.employeeId,
            financialYear: financialYear,
            [month]: { $gt: 0 }, // Only count active months with billing > 0
          });
          employeeClientCounts[billing.employeeId][month] = clientCount;
        }
      }

      months.forEach(month => {
        const clientCount = employeeClientCounts[billing.employeeId][month];
        if (clientCount > 0 && billing[month] > 0) {
          totalSalariesInINR[month] += salaryRecord[month] / clientCount;
        }
      });
    }

    // Calculate monthly profits
    const monthlyProfits = {};
    months.forEach(month => {
      monthlyProfits[month] = billingAmountsInINR[month] - totalSalariesInINR[month];
    });

    return { monthlyProfits };
  } catch (error) {
    logger.error(`Error generating profitability report: ${error.message}`);
    throw new Error(`Error generating profitability report: ${error.message}`);
  }
};

const getEmployeeProfitabilityReport = async (financialYear) => {
  try {
    const billingData = await BillingSetup.find({ financialYear: financialYear }).populate('employeeId clientId');

    if (!billingData.length) {
      throw new Error('No billing data found for the selected financial year.');
    }

    const employeeData = {};

    for (const billing of billingData) {
      const employeeId = billing.employeeId._id;
      const clientAbbreviation = billing.clientId.abbreviation;
      const billingCurrency = billing.clientId.billingCurrency;

      const exchangeRate = await CurrencyExchangeRate.findOne({
        currencyFrom: billingCurrency,
        currencyTo: 'INR',
        financialYear: financialYear,
      });

      if (!employeeData[employeeId]) {
        employeeData[employeeId] = {
          name: `${billing.employeeId.firstName} ${billing.employeeId.lastName}`,
          clients: [],
          monthlyProfit: {
            Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0,
          },
        };
      }

      if (!employeeData[employeeId].clients.includes(clientAbbreviation)) {
        employeeData[employeeId].clients.push(clientAbbreviation);
      }

      for (const month in employeeData[employeeId].monthlyProfit) {
        employeeData[employeeId].monthlyProfit[month] += billing[month] * exchangeRate.exchangeRate;
      }
    }

    for (const employeeId in employeeData) {
      const employeeCost = await EmployeeCost.findOne({ employeeId, financialYear });
      if (!employeeCost) {
        throw new Error(`No salary record found for employee ID ${employeeId}.`);
      }

      for (const month in employeeData[employeeId].monthlyProfit) {
        employeeData[employeeId].monthlyProfit[month] -= employeeCost[month];
      }
    }

    return employeeData;
  } catch (error) {
    logger.error(`Error generating employee profitability report: ${error.message}`);
    throw new Error(`Error generating employee profitability report: ${error.message}`);
  }
};

module.exports = { getProfitabilityReport, getEmployeeProfitabilityReport };
