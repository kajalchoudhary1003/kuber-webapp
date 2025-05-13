// services/billingService.js
const { Op } = require('sequelize');
const BillingDetail = require('../models/billingDetailModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const Currency = require('../models/currencyModel');
const logger = require('../utils/logger');

// Fetch clients for a given year
const getClientsForYear = async (year) => {
  try {
    const parsedYear = parseInt(year, 10);
    logger.info(`Fetching clients for year: ${parsedYear}`);

    // First get all unique client IDs from billing details
    const billingDetails = await BillingDetail.findAll({
      where: { Year: parsedYear },
      attributes: ['ClientID'],
      group: ['ClientID'],
      raw: true
    });

    logger.info(`Found ${billingDetails.length} unique clients with billing details`);

    // Then fetch the full client details
    const clientIds = billingDetails.map(detail => detail.ClientID);
    const clients = await Client.findAll({
      where: { id: { [Op.in]: clientIds } },
      attributes: ['id', 'ClientName', 'Abbreviation'],
      paranoid: false
    });

    logger.info(`Retrieved ${clients.length} client details`);
    return clients;
  } catch (error) {
    logger.error(`Error fetching clients for year: ${error.message}`);
    throw new Error(`Error fetching clients for year: ${error.message}`);
  }
};

// Fetch billing data based on clientId and year
const getBillingData = async (clientId, year) => {
  try {
    const parsedYear = parseInt(year, 10);
    const billingDetails = await BillingDetail.findAll({
      where: { ClientID: clientId, Year: parsedYear },
      include: [
        {
          model: Employee,
          attributes: ['FirstName', 'LastName', 'CTCMonthly'],
          paranoid: false,
        },
        {
          model: Client,
          attributes: ['BillingCurrencyID'],
          include: [
            {
              model: Currency,
              attributes: ['CurrencyCode'],
              as: 'BillingCurrency',
            },
          ],
          paranoid: false,
        },
      ],
    });

    return billingDetails.map(detail => ({
      id: detail.id,
      name: `${detail.Employee.FirstName} ${detail.Employee.LastName}`,
      ctcMonthly: detail.Employee.CTCMonthly,
      Apr: detail.Apr,
      May: detail.May,
      Jun: detail.Jun,
      Jul: detail.Jul,
      Aug: detail.Aug,
      Sep: detail.Sep,
      Oct: detail.Oct,
      Nov: detail.Nov,
      Dec: detail.Dec,
      Jan: detail.Jan,
      Feb: detail.Feb,
      Mar: detail.Mar,
      currencyCode: detail.Client.BillingCurrency.CurrencyCode,
    }));
  } catch (error) {
    logger.error(`Error fetching billing data: ${error.message}`);
    throw new Error(`Error fetching billing data: ${error.message}`);
  }
};

// Update billing data for a specific record
const updateBillingData = async (id, month, amount) => {
  try {
    const billingDetail = await BillingDetail.findByPk(id);
    if (!billingDetail) {
      throw new Error(`Billing detail with id ${id} not found`);
    }
    await billingDetail.update({ [month]: amount });
    return billingDetail;
  } catch (error) {
    logger.error(`Error updating billing data: ${error.message}`);
    throw new Error(`Error updating billing data: ${error.message}`);
  }
};

const billingService = {
  getClientsForYear,
  getBillingData,
  updateBillingData
};

module.exports = billingService;
