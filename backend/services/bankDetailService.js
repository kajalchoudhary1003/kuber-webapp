const BankDetail = require('../models/bankDetailModel');
const logger = require('../utils/logger');

const createBankDetail = async (bankDetailData) => {
  try {
    const bankDetail = await BankDetail.create(bankDetailData);
    return bankDetail;
  } catch (error) {
    logger.error(`Error creating bank detail: ${error.message}`);
    throw new Error(`Error creating bank detail: ${error.message}`);
  }
};

const getAllBankDetails = async () => {
  try {
    const bankDetails = await BankDetail.find();
    return bankDetails;
  } catch (error) {
    logger.error(`Error fetching bank details: ${error.message}`);
    throw new Error(`Error fetching bank details: ${error.message}`);
  }
};

const updateBankDetail = async (bankDetailId, updates) => {
  try {
    const bankDetail = await BankDetail.findById(bankDetailId);
    if (!bankDetail) {
      throw new Error(`Bank detail with id ${bankDetailId} not found`);
    }
    const updatedBankDetail = await bankDetail.updateOne(updates);
    return updatedBankDetail;
  } catch (error) {
    logger.error(`Error updating bank detail: ${error.message}`);
    throw new Error(`Error updating bank detail: ${error.message}`);
  }
};

const deleteBankDetail = async (bankDetailId) => {
  try {
    const bankDetail = await BankDetail.findById(bankDetailId);
    if (!bankDetail) {
      throw new Error(`Bank detail with id ${bankDetailId} not found`);
    }
    await bankDetail.remove();
    return { message: 'Bank detail deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting bank detail: ${error.message}`);
    throw new Error(`Error deleting bank detail: ${error.message}`);
  }
};

module.exports = {
  createBankDetail,
  getAllBankDetails,
  updateBankDetail,
  deleteBankDetail,
};
