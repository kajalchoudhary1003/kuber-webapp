const { Op } = require('sequelize');
const FinancialYear = require('../models/financialYearModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const BillingDetail = require('../models/billingDetailModel');
const EmployeeCost = require('../models/EmployeeCostModel');
const Employee = require('../models/employeeModel');
const logger = require('../utils/logger');
const sequelize = require('../db/sequelize');

const getFinancialYears = async ({ page = 1, limit = 2 }) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await FinancialYear.findAndCountAll({
      order: [['year', 'DESC']],
      offset,
      limit,
    });

    return {
      total: count,
      financialYears: rows.map(year => year.toJSON()),
    };
  } catch (error) {
    logger.error(`Error fetching financial years: ${error.message}`);
    throw new Error(`Error fetching financial years: ${error.message}`);
  }
};

const addFinancialYear = async () => {
  const transaction = await sequelize.transaction();

  try {
    const financialYears = await getFinancialYears({ page: 1, limit: 100 });
    let newFinancialYear;

    if (financialYears.financialYears.length === 0) {
      logger.info('No financial years found, creating new financial year');
      newFinancialYear = `${new Date().getFullYear()}`;
    } else {
      logger.info('Financial years found, creating new financial year');
      const lastYear = parseInt(financialYears.financialYears[0].year, 10);
      newFinancialYear = `${lastYear + 1}`;
      logger.info(`Last year: ${lastYear}, new year: ${newFinancialYear}`);
    }

    const financialYear = await FinancialYear.create({ year: newFinancialYear }, { transaction });

    logger.info(`New financial year created: ${newFinancialYear}`);

    // Billing Details
    const activeClientEmployees = await ClientEmployee.findAll({
      where: { Status: 'Active' },
    });

    logger.info(`Active client employees found: ${activeClientEmployees.length}`);

    const billingDetails = activeClientEmployees.flatMap(clientEmployee => {
      if (clientEmployee.Status !== 'Active') return [];

      return [{
        EmployeeID: clientEmployee.EmployeeID,
        ClientID: clientEmployee.ClientID,
        Year: parseInt(newFinancialYear, 10),
        Apr: clientEmployee.MonthlyBilling,
        May: clientEmployee.MonthlyBilling,
        Jun: clientEmployee.MonthlyBilling,
        Jul: clientEmployee.MonthlyBilling,
        Aug: clientEmployee.MonthlyBilling,
        Sep: clientEmployee.MonthlyBilling,
        Oct: clientEmployee.MonthlyBilling,
        Nov: clientEmployee.MonthlyBilling,
        Dec: clientEmployee.MonthlyBilling,
        Jan: clientEmployee.MonthlyBilling,
        Feb: clientEmployee.MonthlyBilling,
        Mar: clientEmployee.MonthlyBilling,
      }];
    });

    logger.info(`Billing details to be added: ${billingDetails.length}`);

    if (billingDetails.length > 0) {
      await BillingDetail.bulkCreate(billingDetails, { transaction });
    }

    // Employee Costs
    const activeEmployees = await Employee.findAll({
      where: { Status: 'Active' },
    });

    logger.info(`Active employees found: ${activeEmployees.length}`);

    const employeeCosts = [];

    for (const employee of activeEmployees) {
      const existingCost = await EmployeeCost.findOne({
        where: {
          EmployeeID: employee.id,
          Year: newFinancialYear,
        },
        transaction,
      });

      if (!existingCost) {
        employeeCosts.push({
          EmployeeID: employee.id,
          Year: parseInt(newFinancialYear, 10),
          Apr: employee.CTCMonthly,
          May: employee.CTCMonthly,
          Jun: employee.CTCMonthly,
          Jul: employee.CTCMonthly,
          Aug: employee.CTCMonthly,
          Sep: employee.CTCMonthly,
          Oct: employee.CTCMonthly,
          Nov: employee.CTCMonthly,
          Dec: employee.CTCMonthly,
          Jan: employee.CTCMonthly,
          Feb: employee.CTCMonthly,
          Mar: employee.CTCMonthly,
        });
      }
    }

    logger.info(`Employee costs to be added: ${employeeCosts.length}`);

    if (employeeCosts.length > 0) {
      await EmployeeCost.bulkCreate(employeeCosts, { transaction });
    }

    await transaction.commit();
    logger.info('Transaction committed');

    return financialYear;

  } catch (error) {
    await transaction.rollback();
    logger.error(`Error adding financial year: ${error.message}`);
    throw new Error(`Error adding financial year: ${error.message}`);
  }
};

module.exports = {
  getFinancialYears,
  addFinancialYear,
};
