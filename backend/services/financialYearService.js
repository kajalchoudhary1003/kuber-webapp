const FinancialYear = require('../models/financialYearModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const BillingDetail = require('../models/billingDetailModel');
const EmployeeCost = require('../models/employeeCostModel');
const Employee = require('../models/employeeModel');
const mongoose = require('mongoose');

const getFinancialYears = async ({ page = 1, limit = 2 }) => {
  const skip = (page - 1) * limit;

  const [financialYears, total] = await Promise.all([
    FinancialYear.find().sort({ year: -1 }).skip(skip).limit(limit),
    FinancialYear.countDocuments(),
  ]);

  return {
    total,
    financialYears,
  };
};

const addFinancialYear = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const allYears = await FinancialYear.find().sort({ year: -1 }).limit(1).session(session);
    let newYear;

    if (allYears.length === 0) {
      newYear = `${new Date().getFullYear()}`;
    } else {
      newYear = `${parseInt(allYears[0].year) + 1}`;
    }

    const financialYear = await FinancialYear.create([{ year: newYear }], { session });

    const activeClientEmployees = await ClientEmployee.find({ Status: 'Active' }).session(session);

    const billingDetails = activeClientEmployees.map(emp => ({
      EmployeeID: emp.EmployeeID,
      ClientID: emp.ClientID,
      Year: parseInt(newYear),
      Apr: emp.MonthlyBilling,
      May: emp.MonthlyBilling,
      Jun: emp.MonthlyBilling,
      Jul: emp.MonthlyBilling,
      Aug: emp.MonthlyBilling,
      Sep: emp.MonthlyBilling,
      Oct: emp.MonthlyBilling,
      Nov: emp.MonthlyBilling,
      Dec: emp.MonthlyBilling,
      Jan: emp.MonthlyBilling,
      Feb: emp.MonthlyBilling,
      Mar: emp.MonthlyBilling,
    }));

    if (billingDetails.length) {
      await BillingDetail.insertMany(billingDetails, { session });
    }

    const activeEmployees = await Employee.find({ Status: 'Active' }).session(session);

    const employeeCosts = activeEmployees.map(emp => ({
      EmployeeID: emp._id,
      Year: parseInt(newYear),
      Apr: emp.CTCMonthly,
      May: emp.CTCMonthly,
      Jun: emp.CTCMonthly,
      Jul: emp.CTCMonthly,
      Aug: emp.CTCMonthly,
      Sep: emp.CTCMonthly,
      Oct: emp.CTCMonthly,
      Nov: emp.CTCMonthly,
      Dec: emp.CTCMonthly,
      Jan: emp.CTCMonthly,
      Feb: emp.CTCMonthly,
      Mar: emp.CTCMonthly,
    }));

    if (employeeCosts.length) {
      await EmployeeCost.insertMany(employeeCosts, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return financialYear[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error adding financial year: ${err.message}`);
  }
};

module.exports = {
  getFinancialYears,
  addFinancialYear,
};
