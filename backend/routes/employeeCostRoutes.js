const express = require('express');
const router = express.Router();
const {
  getEmployeeCostData,
  updateEmployeeCostData,
} = require('../controllers/employeeCostController');

// GET /api/employee-cost/:year
router.get('/:year', getEmployeeCostData);

// PUT /api/employee-cost/:id
router.put('/:id', updateEmployeeCostData);

module.exports = router;
