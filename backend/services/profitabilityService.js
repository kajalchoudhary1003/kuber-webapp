const BillingSetup = require('../models/billingDetailModel');
const CurrencyExchangeRate = require('../models/currencyExchangeRateModel');
const Currency = require('../models/currencyModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');
const EmployeeCost = require('../models/employeeCostModel');
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

const getClientProfitabilityReport = async (financialYear) => {
  try {
    // Step 1: Fetch all billing data for the specified financial year
    const billingData = await BillingSetup.findAll({
      where: { Year: financialYear },
      include: [
        { model: Employee, attributes: ['id', 'FirstName', 'LastName'] },
        { model: Client, attributes: ['id', 'ClientName', 'BillingCurrencyID'] },
      ],
    });

    if (!billingData.length) {
      throw new Error('No billing data found for the selected financial year.');
    }

    // Step 2: Initialize data structure to hold profitability by client
    const clientData = {};

    for (const billing of billingData) {
      const clientId = billing.Client.id;
      const clientName = billing.Client.ClientName;
      const billingCurrency = billing.Client.BillingCurrencyID;
      const employeeId = billing.Employee.id;

      // Fetch the exchange rate from billing currency to INR
      const inrCurrency = await Currency.findOne({ where: { CurrencyName: 'INR' } });
      if (!inrCurrency) throw new Error('INR currency not found.');

      const exchangeRate = await CurrencyExchangeRate.findOne({
        where: {
          CurrencyFromID: billingCurrency,
          CurrencyToID: inrCurrency.id,
          Year: financialYear,
        },
      });

      if (!exchangeRate) {
        throw new Error(`No exchange rate found for currency ${billingCurrency}.`);
      }

      // Initialize client entry if not already present
      if (!clientData[clientId]) {
        clientData[clientId] = {
          clientName,
          monthlyProfit: {
            Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0,
          },
        };
      }

      // Step 3: Calculate and sum billing amounts to INR for each month
      for (const month in clientData[clientId].monthlyProfit) {
        if (billing[month] > 0) {
          // Find how many clients the employee is working for in this financial year with non-zero billing
          const clientsWithNonZeroBilling = await BillingSetup.count({
            where: {
              EmployeeID: employeeId,
              Year: financialYear,
              [`${month}`]: { [Op.gt]: 0 },
            },
          });

          // Get the employee cost and average it across the number of clients
          const employeeCost = await EmployeeCost.findOne({
            where: {
              EmployeeID: employeeId,
              Year: financialYear,
            },
          });

          if (!employeeCost) {
            throw new Error(`No salary record found for employee ID ${employeeId}.`);
          }

          // Calculate the monthly profit after deducting the averaged salary
          const adjustedSalary = employeeCost[month] / clientsWithNonZeroBilling;
          const monthlyProfit = (billing[month] * exchangeRate.ExchangeRate) - adjustedSalary;

          // Add the profit to the client's monthly profit, rounded to two decimal places
          clientData[clientId].monthlyProfit[month] += parseFloat(monthlyProfit.toFixed(2));
        }
      }
    }

    // Log the structured client data
    logger.info(`Client profitability data: ${JSON.stringify(clientData, null, 2)}`);

    return clientData;
  } catch (error) {
    logger.error(`Error generating client profitability report: ${error.message}`);
    throw new Error(`Error generating client profitability report: ${error.message}`);
  }
};


module.exports = { getProfitabilityReport, getEmployeeProfitabilityReport, getClientProfitabilityReport};
