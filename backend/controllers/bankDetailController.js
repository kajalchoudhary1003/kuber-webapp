const bankDetailsService = require('../services/bankDetailService');
const logger = require('../utils/logger');

const createBankDetail = async (req, res) => {
  try {
    const bankDetailData = req.body; // Receive the bank detail data from request body
    logger.info('Create bank detail service called');
    const bankDetail = await bankDetailsService.createBankDetail(bankDetailData);
    res.status(201).json(bankDetail);
  } catch (error) {
    logger.error(`Error creating bank detail: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getAllBankDetails = async (req, res) => {
  try {
    logger.info('Get all bank details service called');
    const bankDetails = await bankDetailsService.getAllBankDetails();
    res.status(200).json(bankDetails);
  } catch (error) {
    logger.error(`Error fetching bank details: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const updateBankDetail = async (req, res) => {
  const { bankDetailId } = req.params;
  const updates = req.body;

  try {
    logger.info(`Update bank detail service called for bankDetailId: ${bankDetailId}`);
    const updatedBankDetail = await bankDetailsService.updateBankDetail(bankDetailId, updates);
    res.status(200).json(updatedBankDetail);
  } catch (error) {
    logger.error(`Error updating bank detail: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const deleteBankDetail = async (req, res) => {
  const { bankDetailId } = req.params;

  try {
    logger.info(`Delete bank detail service called for bankDetailId: ${bankDetailId}`);
    const result = await bankDetailsService.deleteBankDetail(bankDetailId);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting bank detail: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBankDetail,
  getAllBankDetails,
  updateBankDetail,
  deleteBankDetail,
};
