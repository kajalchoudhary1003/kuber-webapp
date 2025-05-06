const employeeCostService = require('../services/employeeCostService');

const getEmployeeCostData = async (req, res) => {
  const { year } = req.params;
  try {
    const data = await employeeCostService.getEmployeeCostData(year);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployeeCostData = async (req, res) => {
  const { id } = req.params;
  const { month, amount } = req.body;
  try {
    const data = await employeeCostService.updateEmployeeCostData(id, month, amount);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEmployeeCostData,
  updateEmployeeCostData,
};
