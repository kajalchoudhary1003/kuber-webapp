const { Op } = require('sequelize');
const Employee = require('../models/employeeModel');
const Organisation = require('../models/organisationModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const Client = require('../models/clientModel');
const EmployeeCost = require('../models/employeeCostModel');
const FinancialYear = require('../models/financialYearModel');
const Level = require('../models/levelModel'); // Added import for Level model
const Role = require('../models/roleModel'); // Added import for Role model
const logger = require('../utils/logger');

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const createEmployee = async (employeeData, year) => {
  try {
    const existingEmployee = await Employee.findOne({
      where: { EmpCode: employeeData.EmpCode }
    });
    if (existingEmployee) {
      throw new Error('Employee with this code already exists');
    }

    // Create the employee
    const employee = await Employee.create(employeeData);

    // Get all financial years
    const financialYears = await FinancialYear.findAll({
      order: [['year', 'DESC']]
    });

    if (financialYears.length === 0) {
      throw new Error('No financial years found');
    }

    // Create employee cost records for all financial years
    const monthlyCTC = employee.CTCMonthly || 0; // Fallback to 0 if CTCMonthly is not set
    const employeeCosts = financialYears.map(year => ({
      EmployeeID: employee.id,
      Year: parseInt(year.year, 10),
      Apr: monthlyCTC,
      May: monthlyCTC,
      Jun: monthlyCTC,
      Jul: monthlyCTC,
      Aug: monthlyCTC,
      Sep: monthlyCTC,
      Oct: monthlyCTC,
      Nov: monthlyCTC,
      Dec: monthlyCTC,
      Jan: monthlyCTC,
      Feb: monthlyCTC,
      Mar: monthlyCTC
    }));

    await EmployeeCost.bulkCreate(employeeCosts, {
      ignoreDuplicates: true // This will skip any duplicates instead of failing
    });

    return employee;
  } catch (error) {
    throw new Error(`Error creating employee: ${error.message}`);
  }
};

const updateEmployee = async (employeeId, updates) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (updates.EmpCode && updates.EmpCode !== employee.EmpCode) {
      const existingEmployee = await Employee.findOne({
        where: { EmpCode: updates.EmpCode }
      });
      if (existingEmployee) {
        throw new Error('Employee with this code already exists');
      }
    }

    await employee.update(updates);
    return employee;
  } catch (error) {
    throw new Error(`Error updating employee: ${error.message}`);
  }
};

const getAllEmployees = async (page = 1, limit = 10, query = '') => {
  try {
    const offset = (page - 1) * limit;
    const whereClause = query
      ? {
          [Op.or]: [
            { FirstName: { [Op.like]: `%${query}%` } },
            { LastName: { [Op.like]: `%${query}%` } },
          ],
        }
      : {};

    const employees = await Employee.findAll({
      where: whereClause,
      include: [
        { model: Organisation, as: 'Organisation' },
        { model: Level, as: 'Level' }, // Added Level model
        { model: Role, as: 'Role' }, // Added Role model
      ],
      offset,
      limit
    });

    const total = await Employee.count({ where: whereClause });

    return {
      employees,
      total,
    };
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
};

const getEmployeeById = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId, {
      include: [
        { model: Organisation, as: 'Organisation' },
        { model: Level, as: 'Level' }, // Added Level model
        { model: Role, as: 'Role' }, // Added Role model
      ]
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  } catch (error) {
    throw new Error(`Error fetching employee: ${error.message}`);
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const activeAssignments = await ClientEmployee.findOne({
      where: { EmployeeID: employeeId, Status: 'Active' }
    });

    if (activeAssignments) {
      throw new Error('Cannot delete employee with active client assignments');
    }

    await employee.destroy();
    return { message: 'Employee deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting employee: ${error.message}`);
  }
};

const searchEmployees = async (query) => {
  try {
    const employees = await Employee.findAll({
      where: {
        [Op.or]: [
          { FirstName: { [Op.like]: `%${query}%` } },
          { LastName: { [Op.like]: `%${query}%` } },
          { EmpCode: { [Op.like]: `%${query}%` } },
          { Email: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        { model: Organisation, as: 'Organisation' },
        { model: Level, as: 'Level' }, // Added Level model
        { model: Role, as: 'Role' }, // Added Role model
      ]
    });
    return employees;
  } catch (error) {
    throw new Error(`Error searching employees: ${error.message}`);
  }
};

const getEmployeeClients = async (id) => {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const clientAssignments = await ClientEmployee.findAll({
      where: { EmployeeID: id },
      include: [
        { model: Client, as: 'Client' }
      ]
    });

    return clientAssignments;
  } catch (error) {
    throw new Error(`Error fetching employee clients: ${error.message}`);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeClients,
};