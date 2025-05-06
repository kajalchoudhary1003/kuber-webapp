const Employee = require('../models/employeeModel');
const EmployeeCost = require('../models/employeeCostModel');
const logger = require('../utils/logger');

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const createEmployee = async (employeeData) => {
  try {
    const employee = new Employee(employeeData);
    await employee.save();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const ctcMonthly = parseFloat(employee.CTCMonthly);
    const fiscalYear = currentMonth >= 4 ? currentYear : currentYear - 1;

    const employeeCostData = {
      EmployeeID: employee._id,
      Year: fiscalYear,
    };

    fiscalMonths.forEach((month, index) => {
      const fiscalMonthIndex = (index + 4) % 12 || 12;
      if (fiscalMonthIndex >= currentMonth || fiscalMonthIndex <= 3) {
        employeeCostData[month] = ctcMonthly;
      }
    });

    const employeeCost = new EmployeeCost(employeeCostData);
    await employeeCost.save();

    return employee.toObject();
  } catch (error) {
    throw new Error(`Error creating employee: ${error.message}`);
  }
};

const updateEmployee = async (employeeId, updates) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const fiscalYear = currentMonth >= 4 ? currentYear : currentYear - 1;

    if (updates.CTCMonthly && parseFloat(updates.CTCMonthly) !== parseFloat(employee.CTCMonthly)) {
      logger.info('CTC has changed, updating EmployeeCost document...');
      let employeeCost = await EmployeeCost.findOne({ EmployeeID: employee._id, Year: fiscalYear });

      if (!employeeCost) {
        employeeCost = new EmployeeCost({
          EmployeeID: employee._id,
          Year: fiscalYear,
        });
      }

      fiscalMonths.forEach((month, index) => {
        const fiscalMonthIndex = (index + 4) % 12 || 12;
        if (fiscalMonthIndex >= currentMonth || fiscalMonthIndex <= 3) {
          employeeCost[month] = parseFloat(updates.CTCMonthly);
        }
      });

      await employeeCost.save();
    }

    Object.assign(employee, updates);
    await employee.save();

    return employee.toObject();
  } catch (error) {
    logger.error(`Error updating employee: ${error.message}`);
    throw new Error(`Error updating employee: ${error.message}`);
  }
};

const getAllEmployees = async (page = 1, limit = 10, query = '') => {
  try {
    const offset = (page - 1) * limit;
    const searchCondition = query
      ? {
          $or: [
            { FirstName: { $regex: query, $options: 'i' } },
            { LastName: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const employees = await Employee.find(searchCondition)
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Employee.countDocuments(searchCondition);

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
    const employee = await Employee.findById(employeeId).lean();
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }
    return employee;
  } catch (error) {
    logger.error(`Error fetching employee: ${error.message}`);
    throw new Error(`Error fetching employee: ${error.message}`);
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (employee.Status === 'Active') {
      throw new Error('Active employee cannot be deleted');
    }

    await Employee.deleteOne({ _id: employeeId });
    return { message: 'Employee deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting employee: ${error.message}`);
    throw new Error(`Error deleting employee: ${error.message}`);
  }
};

const searchEmployees = async (query) => {
  try {
    logger.info(`Search employees service called with query: ${query}`);
    const employees = await Employee.find({
      $or: [
        { FirstName: { $regex: query, $options: 'i' } },
        { LastName: { $regex: query, $options: 'i' } },
      ],
    }).lean();
    return employees;
  } catch (error) {
    logger.error(`Error searching employees: ${error.message}`);
    throw new Error(`Error searching employees: ${error.message}`);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
};
