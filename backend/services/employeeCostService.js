const { Op } = require('sequelize');
const EmployeeCost = require('../models/employeeCostModel');
const Employee = require('../models/employeeModel');

const getEmployeeCostData = async (year) => {
  try {
    const employeeCosts = await EmployeeCost.findAll({
      where: { Year: year },
      include: [
        {
          model: Employee,
          attributes: ['FirstName', 'LastName'],
          paranoid: false, // Include soft-deleted employees
        },
      ],
    });

    return employeeCosts.map((cost) => ({
      id: cost.id,
      name: `${cost.Employee.FirstName} ${cost.Employee.LastName}`,
      Apr: cost.Apr,
      May: cost.May,
      Jun: cost.Jun,
      Jul: cost.Jul,
      Aug: cost.Aug,
      Sep: cost.Sep,
      Oct: cost.Oct,
      Nov: cost.Nov,
      Dec: cost.Dec,
      Jan: cost.Jan,
      Feb: cost.Feb,
      Mar: cost.Mar,
    }));
  } catch (error) {
    throw new Error(`Error fetching employee cost data: ${error.message}`);
  }
};

const updateEmployeeCostData = async (id, month, amount) => {
  try {
    const employeeCost = await EmployeeCost.findByPk(id);

    if (!employeeCost) {
      throw new Error(`EmployeeCost with id ${id} not found`);
    }

    employeeCost[month] = parseFloat(amount);
    await employeeCost.save();

    return employeeCost;
  } catch (error) {
    throw new Error(`Error updating employee cost data: ${error.message}`);
  }
};

module.exports = {
  getEmployeeCostData,
  updateEmployeeCostData,
};
