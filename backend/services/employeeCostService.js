const EmployeeCost = require('../models/employeeCostModel');
const Employee = require('../models/employeeModel');
const mongoose = require('mongoose');

const getEmployeeCostData = async (year) => {
  try {
    const costs = await EmployeeCost.find({ Year: year }).populate({
      path: 'EmployeeID', // Corrected field name 
      select: 'FirstName LastName',
      options: { withDeleted: true } // Optional, if using mongoose-delete for soft deletes
    });

    return costs.map(cost => ({
      id: cost._id,
      name: `${cost.EmployeeID?.FirstName || ''} ${cost.EmployeeID?.LastName || ''}`,
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

  const validMonths = [
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'
  ];

  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }

    if (!validMonths.includes(month)) {
      throw new Error(`Invalid month: ${month}. Valid months are ${validMonths.join(', ')}`);
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error(`Invalid amount: ${amount}. Please provide a valid number.`);
    }

    const updatedEmployeeCost = await EmployeeCost.findOneAndUpdate(
      { _id: id },
      { $set: { [month]: parsedAmount } }, 
      { new: true, runValidators: true }    // `new: true` ensures we get the updated document back
    );

    if (!updatedEmployeeCost) {
      throw new Error(`EmployeeCost with id ${id} not found`);
    }

    return updatedEmployeeCost;
  } catch (error) {
    throw new Error(`Error updating employee cost data: ${error.message}`);
  }
};


module.exports = {
  getEmployeeCostData,
  updateEmployeeCostData,
};
