const { Op } = require('sequelize');
const EmployeeCost = require('../models/employeeCostModel');
const Employee = require('../models/employeeModel');

const employeeCostService = {
  async getAllEmployeeCosts() {
    try {
      const costs = await EmployeeCost.findAll({
        include: [{ model: Employee, as: 'Employee' }],
        order: [['Year', 'DESC'], ['Month', 'DESC']]
      });
      return costs;
    } catch (error) {
      throw new Error('Error fetching employee costs: ' + error.message);
    }
  },

  async getEmployeeCostById(id) {
    try {
      const cost = await EmployeeCost.findByPk(id, {
        include: [{ model: Employee, as: 'Employee' }]
      });
      if (!cost) {
        throw new Error('Employee cost not found');
      }
      return cost;
    } catch (error) {
      throw new Error('Error fetching employee cost: ' + error.message);
    }
  },

  async createEmployeeCost(costData) {
    try {
      // Validate employee exists
      const employee = await Employee.findByPk(costData.EmployeeID);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Check for existing cost record
      const existingCost = await EmployeeCost.findOne({
        where: {
          EmployeeID: costData.EmployeeID,
          Year: costData.Year,
          Month: costData.Month
        }
      });

      if (existingCost) {
        throw new Error('Cost record already exists for this employee and period');
      }

      const cost = await EmployeeCost.create(costData);
      return cost;
    } catch (error) {
      throw new Error('Error creating employee cost: ' + error.message);
    }
  },

  async updateEmployeeCost(id, costData) {
    try {
      const cost = await EmployeeCost.findByPk(id);
      if (!cost) {
        throw new Error('Employee cost not found');
      }

      // If employee is being changed, validate it exists
      if (costData.EmployeeID && costData.EmployeeID !== cost.EmployeeID) {
        const employee = await Employee.findByPk(costData.EmployeeID);
        if (!employee) {
          throw new Error('Employee not found');
        }
      }

      // Check for duplicate if period or employee is being changed
      if (costData.Year || costData.Month || costData.EmployeeID) {
        const existingCost = await EmployeeCost.findOne({
          where: {
            EmployeeID: costData.EmployeeID || cost.EmployeeID,
            Year: costData.Year || cost.Year,
            Month: costData.Month || cost.Month,
            id: { [Op.ne]: id }
          }
        });

        if (existingCost) {
          throw new Error('Cost record already exists for this employee and period');
        }
      }

      await cost.update(costData);
      return cost;
    } catch (error) {
      throw new Error('Error updating employee cost: ' + error.message);
    }
  },

  async deleteEmployeeCost(id) {
    try {
      const cost = await EmployeeCost.findByPk(id);
      if (!cost) {
        throw new Error('Employee cost not found');
      }
      await cost.destroy();
      return { message: 'Employee cost deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting employee cost: ' + error.message);
    }
  },

  async searchEmployeeCosts(query) {
    try {
      const costs = await EmployeeCost.findAll({
        where: {
          [Op.or]: [
            { Year: { [Op.like]: `%${query}%` } },
            { Month: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [{ model: Employee, as: 'Employee' }],
        order: [['Year', 'DESC'], ['Month', 'DESC']]
      });
      return costs;
    } catch (error) {
      throw new Error('Error searching employee costs: ' + error.message);
    }
  },

  async getEmployeeCostsByEmployee(employeeId) {
    try {
      const costs = await EmployeeCost.findAll({
        where: { EmployeeID: employeeId },
        include: [{ model: Employee, as: 'Employee' }],
        order: [['Year', 'DESC'], ['Month', 'DESC']]
      });
      return costs;
    } catch (error) {
      throw new Error('Error fetching employee costs: ' + error.message);
    }
  },

  async getEmployeeCostsByPeriod(year, month) {
    try {
      const costs = await EmployeeCost.findAll({
        where: {
          Year: year,
          Month: month
        },
        include: [{ model: Employee, as: 'Employee' }],
        order: [['EmployeeID', 'ASC']]
      });
      return costs;
    } catch (error) {
      throw new Error('Error fetching employee costs: ' + error.message);
    }
  }
};

module.exports = employeeCostService;
