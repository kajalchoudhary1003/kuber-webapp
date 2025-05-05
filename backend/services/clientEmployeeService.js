const mongoose = require('mongoose');
const ClientEmployee = require('../models/clientEmployeeModel');
const BillingDetail = require('../models/billingDetailModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const Role = require('../models/roleModel');
const Level = require('../models/levelModel');
const Organisation = require('../models/organisationModel');

// Fiscal months array
const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive' };
const FISCAL_YEAR_START_MONTH = 4;  // April is the start of the fiscal year

// Assigns an employee to a client and updates billing details.
const assignEmployeeToClient = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await validateData(data);

    const existingRecord = await ClientEmployee.findOne({
      EmployeeID: data.EmployeeID,
      ClientID: data.ClientID,
      Status: { $ne: STATUS.INACTIVE },
    }).session(session);

    if (existingRecord) {
      throw new Error('Resource already exists');
    }

    const clientEmployee = await ClientEmployee.create([data], { session });

    await updateBillingDetail(data, session);

    await session.commitTransaction();
    session.endSession();
    return clientEmployee[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error assigning employee to client: ${error.message}`);
  }
};

// Updates billing details based on the start and inactive dates.
const updateBillingDetail = async (data, session, inactiveDate = null, yearOverride = null) => {
  const fiscalYear = yearOverride || getFiscalYear(data.MonthIndex);

  // Update billing details with the monthly billing value
  await BillingDetail.updateOne(
    { EmployeeID: data.EmployeeID, ClientID: data.ClientID, Year: fiscalYear },
    { 
      $set: { 
        [fiscalMonths[data.MonthIndex]]: data.MonthlyBilling,
        Status: inactiveDate ? STATUS.INACTIVE : STATUS.ACTIVE,
        InactiveDate: inactiveDate || null,
      }
    },
    { session }
  );
};

// Helper function to get the fiscal year based on the month index
const getFiscalYear = (monthIndex) => {
  const currentYear = new Date().getFullYear();
  if (monthIndex < FISCAL_YEAR_START_MONTH) {
    // If month is before April, it's the previous fiscal year
    return currentYear - 1;
  }
  return currentYear;
};

// Helper function to validate data before creating or updating a client employee record
const validateData = async (data) => {
  const employee = await Employee.findById(data.EmployeeID);
  if (!employee) {
    throw new Error(`Employee with ID ${data.EmployeeID} does not exist`);
  }

  const client = await Client.findById(data.ClientID);
  if (!client) {
    throw new Error(`Client with ID ${data.ClientID} does not exist`);
  }

  if (data.MonthlyBilling && data.MonthlyBilling < 0) {
    throw new Error('Monthly billing value must be a positive number');
  }
};

// Retrieves all employees assigned to a client
const getClientEmployees = async (clientId) => {
  return ClientEmployee.find({ ClientID: clientId });
};

// Retrieves a single client employee by ID
const getClientEmployeeById = async (id) => {
  return ClientEmployee.findById(id);
};

// Updates an existing client employee record
const updateClientEmployee = async (id, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await validateData(data);

    const updatedClientEmployee = await ClientEmployee.findByIdAndUpdate(id, data, { new: true, session });
    await updateBillingDetail(data, session);

    await session.commitTransaction();
    session.endSession();

    return updatedClientEmployee;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error updating client employee: ${error.message}`);
  }
};

// Deletes a client employee record
const deleteClientEmployee = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const clientEmployee = await ClientEmployee.findById(id).session(session);
    if (!clientEmployee) {
      throw new Error('Client employee not found');
    }

    // Marking as inactive instead of actual deletion
    clientEmployee.Status = STATUS.INACTIVE;
    await clientEmployee.save({ session });

    await updateBillingDetail(clientEmployee, session, new Date(), clientEmployee.Year);

    await session.commitTransaction();
    session.endSession();

    return clientEmployee;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error deleting client employee: ${error.message}`);
  }
};

module.exports = {
  assignEmployeeToClient,
  getClientEmployees,
  getClientEmployeeById,
  updateClientEmployee,
  deleteClientEmployee,
};
