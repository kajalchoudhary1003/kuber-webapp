const EmployeeCost = require('../models/EmployeeCostModel');
const Employee = require('../models/employeeModel');

const getEmployeeCostData = async (year) => {
  try {
    const costs = await EmployeeCost.find({ Year: year }).populate({
      path: 'Employee',
      select: 'FirstName LastName',
      options: { withDeleted: true } // if using mongoose-delete for soft deletes
    });

    return costs.map(cost => ({
      id: cost._id,
      name: `${cost.Employee?.FirstName || ''} ${cost.Employee?.LastName || ''}`,
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
    const employeeCost = await EmployeeCost.findById(id);

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
