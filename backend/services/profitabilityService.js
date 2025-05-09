const { Op } = require('sequelize');
const BillingSetup = require('../models/billingDetailModel');
const CurrencyExchangeRate = require('../models/currencyExchangeRateModel');
const Currency = require('../models/currencyModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');
const EmployeeCost = require('../models/employeeCostModel');
const logger = require('../utils/logger');

// Helper function to calculate profit
const calculateProfit = (revenue, cost) => {
  return revenue - cost;
};

// Fetch profitability report for a specific client and financial year
const getProfitabilityReport = async (clientId, financialYear) => {
  try {
    // Fetch client information
    const client = await Client.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error('Client not found');
    }

    // Fetch client-specific billing setups for the given financial year
    const billingDetails = await BillingSetup.findAll({
      where: {
        clientId: clientId,
        financialYear: financialYear,
      },
    });

    if (!billingDetails || billingDetails.length === 0) {
      throw new Error('No billing details found for the given financial year');
    }

    // Fetch currency exchange rates for the financial year
    const exchangeRates = await CurrencyExchangeRate.findAll({
      where: {
        financialYear: financialYear,
      },
    });

    // Assume exchange rates are based on USD for conversion
    const usdToCurrencyRate = exchangeRates.find(rate => rate.fromCurrency === 'USD' && rate.toCurrency === client.currency);
    if (!usdToCurrencyRate) {
      throw new Error('Exchange rate not found for the specified currency');
    }

    // Get the total revenue and cost
    let totalRevenue = 0;
    let totalCost = 0;

    for (const billing of billingDetails) {
      totalRevenue += billing.revenue;
      totalCost += billing.cost;
    }

    // Convert total revenue and cost to the client’s currency
    totalRevenue *= usdToCurrencyRate.rate;
    totalCost *= usdToCurrencyRate.rate;

    // Calculate profit
    const profit = calculateProfit(totalRevenue, totalCost);

    // Prepare the report
    const report = {
      clientId,
      clientName: client.name,
      financialYear,
      totalRevenue,
      totalCost,
      profit,
      currency: client.currency,
    };

    return report;
  } catch (error) {
    logger.error(`Error generating profitability report: ${error.message}`);
    throw error;
  }
};

// Fetch profitability report for all employees for a specific financial year
const getEmployeeProfitabilityReport = async (financialYear) => {
  try {
    // Fetch employee details for the given financial year
    const employees = await Employee.findAll({
      include: [
        {
          model: EmployeeCost,
          where: { financialYear },
        },
      ],
    });

    if (!employees || employees.length === 0) {
      throw new Error('No employees found for the given financial year');
    }

    // Initialize report
    const employeeReports = [];

    // Loop through each employee and calculate profitability
    for (const employee of employees) {
      const revenue = employee.revenue || 0;
      const cost = employee.EmployeeCosts.reduce((acc, cost) => acc + cost.amount, 0);
      const profit = calculateProfit(revenue, cost);

      employeeReports.push({
        employeeId: employee.id,
        employeeName: employee.name,
        revenue,
        cost,
        profit,
        financialYear,
      });
    }

    return employeeReports;
  } catch (error) {
    logger.error(`Error generating employee profitability report: ${error.message}`);
    throw error;
  }
};

// Fetch profitability report for all clients for a specific financial year
const getClientProfitabilityReport = async (financialYear) => {
  try {
    // Fetch all clients and their related billing details for the given financial year
    const clients = await Client.findAll({
      include: [
        {
          model: BillingSetup,
          where: { financialYear },
        },
      ],
    });

    if (!clients || clients.length === 0) {
      throw new Error('No clients found for the given financial year');
    }

    // Initialize report
    const clientReports = [];

    // Loop through each client and calculate profitability
    for (const client of clients) {
      const revenue = client.BillingSetups.reduce((acc, billing) => acc + billing.revenue, 0);
      const cost = client.BillingSetups.reduce((acc, billing) => acc + billing.cost, 0);
      const profit = calculateProfit(revenue, cost);

      clientReports.push({
        clientId: client.id,
        clientName: client.name,
        revenue,
        cost,
        profit,
        financialYear,
      });
    }

    return clientReports;
  } catch (error) {
    logger.error(`Error generating client profitability report: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getProfitabilityReport,
  getEmployeeProfitabilityReport,
  getClientProfitabilityReport,
};
