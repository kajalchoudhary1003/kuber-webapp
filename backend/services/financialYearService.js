const { Op } = require('sequelize');
const FinancialYear = require('../models/financialYearModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const BillingDetail = require('../models/billingDetailModel');
const EmployeeCost = require('../models/employeeCostModel');
const Employee = require('../models/employeeModel');

const financialYearService = {
  async getAllFinancialYears() {
    try {
      const years = await FinancialYear.findAll({
        order: [['StartDate', 'DESC']]
      });
      return years;
    } catch (error) {
      throw new Error('Error fetching financial years: ' + error.message);
    }
  },

  async getFinancialYearById(id) {
    try {
      const year = await FinancialYear.findByPk(id);
      if (!year) {
        throw new Error('Financial year not found');
      }
      return year;
    } catch (error) {
      throw new Error('Error fetching financial year: ' + error.message);
    }
  },

  async createFinancialYear(yearData) {
    try {
      // Check for overlapping financial years
      const overlappingYear = await FinancialYear.findOne({
        where: {
          [Op.or]: [
            {
              StartDate: {
                [Op.between]: [yearData.StartDate, yearData.EndDate]
              }
            },
            {
              EndDate: {
                [Op.between]: [yearData.StartDate, yearData.EndDate]
              }
            }
          ]
        }
      });

      if (overlappingYear) {
        throw new Error('Financial year overlaps with an existing period');
      }

      const year = await FinancialYear.create(yearData);
      return year;
    } catch (error) {
      throw new Error('Error creating financial year: ' + error.message);
    }
  },

  async updateFinancialYear(id, yearData) {
    try {
      const year = await FinancialYear.findByPk(id);
      if (!year) {
        throw new Error('Financial year not found');
      }

      // Check for overlapping financial years if dates are being changed
      if (yearData.StartDate || yearData.EndDate) {
        const overlappingYear = await FinancialYear.findOne({
          where: {
            [Op.or]: [
              {
                StartDate: {
                  [Op.between]: [yearData.StartDate || year.StartDate, yearData.EndDate || year.EndDate]
                }
              },
              {
                EndDate: {
                  [Op.between]: [yearData.StartDate || year.StartDate, yearData.EndDate || year.EndDate]
                }
              }
            ],
            id: { [Op.ne]: id }
          }
        });

        if (overlappingYear) {
          throw new Error('Financial year overlaps with an existing period');
        }
      }

      await year.update(yearData);
      return year;
    } catch (error) {
      throw new Error('Error updating financial year: ' + error.message);
    }
  },

  async deleteFinancialYear(id) {
    try {
      const year = await FinancialYear.findByPk(id);
      if (!year) {
        throw new Error('Financial year not found');
      }
      await year.destroy();
      return { message: 'Financial year deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting financial year: ' + error.message);
    }
  },

  async searchFinancialYears(query) {
    try {
      const years = await FinancialYear.findAll({
        where: {
          [Op.or]: [
            { Name: { [Op.like]: `%${query}%` } },
            { Description: { [Op.like]: `%${query}%` } }
          ]
        },
        order: [['StartDate', 'DESC']]
      });
      return years;
    } catch (error) {
      throw new Error('Error searching financial years: ' + error.message);
    }
  },

  async getCurrentFinancialYear() {
    try {
      const currentDate = new Date();
      const year = await FinancialYear.findOne({
        where: {
          StartDate: { [Op.lte]: currentDate },
          EndDate: { [Op.gte]: currentDate }
        }
      });
      if (!year) {
        throw new Error('No active financial year found');
      }
      return year;
    } catch (error) {
      throw new Error('Error fetching current financial year: ' + error.message);
    }
  }
};

module.exports = financialYearService;
