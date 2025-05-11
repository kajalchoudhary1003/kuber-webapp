// routes/clientEmployeeRoutes.js
const express = require('express');
const router = express.Router();
const clientEmployeeController = require('../controllers/clientEmployeeController');

router.post('/', clientEmployeeController.assignEmployeeToClient);
router.get('/client/:clientId', clientEmployeeController.getClientEmployees);
router.get('/:id', clientEmployeeController.getClientEmployeeById);
router.put('/:id', clientEmployeeController.updateClientEmployee);
router.delete('/:id', clientEmployeeController.deleteClientEmployee);

module.exports = router;
