const sequelize = require('../db/sequelize');
const ClientEmployee = require('../models/clientEmployeeModel');
const BillingDetail = require('../models/billingDetailModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const Role = require('../models/roleModel');
const Level = require('../models/levelModel');
const Organisation = require('../models/organisationModel');

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const STATUS = { ACTIVE: 'Active', INACTIVE: 'Inactive' };
const FISCAL_YEAR_START_MONTH = 4;

// Dummy validators (replace with actual schema-based validation if needed)
const validateCreateData = async (data) => {
  if (!data.EmployeeID || !data.ClientID || !data.StartDate || !data.MonthlyBilling) {
    throw new Error('Missing required fields in data');
  }
};

const validateUpdateData = async (data) => {
  // Allow partial updates, but require at least one updatable field
  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data provided for update');
  }
};

const assignEmployeeToClient = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    await validateCreateData(data);

    const existingRecord = await ClientEmployee.findOne({
      where: {
        EmployeeID: data.EmployeeID,
        ClientID: data.ClientID,
        deletedAt: null,
      },
      paranoid: false,
    });

    if (existingRecord) {
      throw new Error('Resource already exists');
    }

    const clientEmployee = await ClientEmployee.create(data, { transaction });

    await updateBillingDetail(data, transaction);

    await transaction.commit();
    return clientEmployee.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error assigning employee to client: ${error.message}`);
  }
};

const updateBillingDetail = async (data, transaction, inactiveDate = null, yearOverride = null) => {
  const startDate = new Date(data.StartDate);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;

  const fiscalYear = yearOverride || (startMonth >= FISCAL_YEAR_START_MONTH ? startYear : startYear - 1);
  const nextFiscalYear = fiscalYear + 1;
  const fiscalMonthIndex = startMonth >= FISCAL_YEAR_START_MONTH ? startMonth - FISCAL_YEAR_START_MONTH : startMonth + 8;

  let endMonthIndexCurrentYear = fiscalMonths.length;
  let endMonthIndexNextYear = fiscalMonths.length;
  let endMonthIndexFurtherYears = fiscalMonths.length;

  if (inactiveDate) {
    const { inactiveMonth, inactiveYear } = extractDateParts(inactiveDate);

    if (inactiveYear === fiscalYear || (inactiveYear === fiscalYear + 1 && inactiveMonth <= 3)) {
      endMonthIndexCurrentYear = calculateMonthIndex(inactiveMonth) + 1;
    } else if (inactiveYear === nextFiscalYear || (inactiveYear === nextFiscalYear + 1 && inactiveMonth <= 3)) {
      endMonthIndexNextYear = calculateMonthIndex(inactiveMonth) + 1;
    } else {
      const yearsDiff = inactiveYear - fiscalYear;
      for (let i = 2; i <= yearsDiff; i++) {
        const yearToProcess = fiscalYear + i;
        await updateExistingYearlyBillingDetail(data, transaction, yearToProcess, 0, 0);
      }
      endMonthIndexFurtherYears = calculateMonthIndex(inactiveMonth) + 1;
    }
  }

  await updateYearlyBillingDetail(data, transaction, fiscalYear, fiscalMonthIndex, endMonthIndexCurrentYear);

  if (endMonthIndexNextYear < fiscalMonths.length) {
    await updateYearlyBillingDetail(data, transaction, nextFiscalYear, 0, endMonthIndexNextYear);
  }

  if (endMonthIndexFurtherYears < fiscalMonths.length && endMonthIndexFurtherYears !== fiscalMonths.length) {
    const furtherYear = nextFiscalYear + 1;
    await updateExistingYearlyBillingDetail(data, transaction, furtherYear, 0, endMonthIndexFurtherYears);
  }
};

const updateYearlyBillingDetail = async (data, transaction, year, startMonthIndex, endMonthIndex) => {
  let billingDetail = await BillingDetail.findOne({
    where: {
      EmployeeID: data.EmployeeID,
      ClientID: data.ClientID,
      Year: year,
    },
    transaction,
  });

  if (billingDetail) {
    for (let i = startMonthIndex; i < fiscalMonths.length; i++) {
      billingDetail[fiscalMonths[i]] = i < endMonthIndex ? data.MonthlyBilling : 0;
    }
    await billingDetail.save({ transaction });
  } else {
    const newBillingDetail = createNewBillingDetail(data, year, startMonthIndex, endMonthIndex);
    await BillingDetail.create(newBillingDetail, { transaction });
  }
};

const updateExistingYearlyBillingDetail = async (data, transaction, year, startMonthIndex, endMonthIndex) => {
  const billingDetail = await BillingDetail.findOne({
    where: {
      EmployeeID: data.EmployeeID,
      ClientID: data.ClientID,
      Year: year,
    },
    transaction,
  });

  if (billingDetail) {
    for (let i = startMonthIndex; i < fiscalMonths.length; i++) {
      billingDetail[fiscalMonths[i]] = i < endMonthIndex ? data.MonthlyBilling : 0;
    await billingDetail.save({ transaction });
  }
};

const createNewBillingDetail = (data, year, startMonthIndex, endMonthIndex) => {
  const newBillingDetail = {
    EmployeeID: data.EmployeeID,
    ClientID: data.ClientID,
    Year: year,
  };
  for (let i = 0; i < fiscalMonths.length; i++) {
    newBillingDetail[fiscalMonths[i]] = i >= startMonthIndex && i < endMonthIndex ? data.MonthlyBilling : 0;
  }
  return newBillingDetail;
};

const getClientEmployees = async (clientId) => {
  try {
    const clientEmployees = await ClientEmployee.findAll({
      where: { ClientID: clientId },
      include: [
        {
          model: Employee,
          include: [Role, Level, Organisation],
          attributes: ['FirstName', 'LastName', 'EmpCode'],
        },
      ],
    });
    return clientEmployees.map((employee) => employee.toJSON());
  } catch (error) {
    throw new Error(`Error fetching client employees: ${error.message}`);
  }
};

const getClientEmployeeById = async (id) => {
  try {
    const clientEmployee = await ClientEmployee.findByPk(id, {
      include: [
        {
          model: Employee,
          include: [Role, Level, Organisation],
          attributes: ['FirstName', 'LastName', 'EmpCode'],
        },
      ],
    });
    if (!clientEmployee) {
      throw new Error(`Client employee with id ${id} not found`);
    }
    return clientEmployee.toJSON();
  } catch (error) {
    throw new Error(`Error fetching client employee: ${error.message}`);
  }
};

const updateClientEmployee = async (id, updates) => {
  const transaction = await sequelize.transaction();
  try {
    const clientEmployee = await ClientEmployee.findByPk(id);
    if (!clientEmployee) {
      throw new Error(`Client employee with id ${id} not found`);
    }

    await validateUpdateData(updates);

    let inactiveDate = null;
    if (updates.Status === STATUS.INACTIVE && updates.EndDate) {
      inactiveDate = new Date(updates.EndDate);
    }

    const updatedClientEmployee = await clientEmployee.update(updates, { transaction });

    const startDate = new Date(clientEmployee.StartDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const fiscalYear = startMonth >= FISCAL_YEAR_START_MONTH ? startYear : startYear - 1;

    await updateBillingDetail(
      {
        ...updates,
        EmployeeID: clientEmployee.EmployeeID,
        ClientID: clientEmployee.ClientID,
        StartDate: clientEmployee.StartDate,
      },
      transaction,
      inactiveDate,
      fiscalYear
    );

    await transaction.commit();
    return updatedClientEmployee.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error updating client employee: ${error.message}`);
  }
};

const deleteClientEmployee = async (id) => {
  try {
    const clientEmployee = await ClientEmployee.findByPk(id);
    if (!clientEmployee) {
      throw new Error(`Client employee not found`);
    }
    if (clientEmployee.Status === STATUS.ACTIVE) {
      throw new Error('Cannot delete client employee with active status');
    }
    await clientEmployee.destroy();
    return { message: 'Client employee deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting client employee: ${error.message}`);
  }
};

// 🛠️ Helpers
const extractDateParts = (dateStr) => {
  const date = new Date(dateStr);
  return {
    inactiveMonth: date.getMonth() + 1,
    inactiveYear: date.getFullYear(),
  };
};

const calculateMonthIndex = (month) => {
  if (month >= FISCAL_YEAR_START_MONTH) {
    return month - FISCAL_YEAR_START_MONTH;
  }
  return month + 8;
};

module.exports = {
  assignEmployeeToClient,
  getClientEmployees,
  getClientEmployeeById,
  updateClientEmployee,
  deleteClientEmployee,
};
