const { Op } = require('sequelize');
const ClientEmployee = require('../models/clientEmployeeModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');

const clientEmployeeService = {
  async getAllClientEmployees() {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'] // Updated attributes
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return clientEmployees;
    } catch (error) {
      throw new Error('Error fetching client employees: ' + error.message);
    }
  },

  async getClientEmployeeById(id) {
    try {
      const clientEmployee = await ClientEmployee.findByPk(id, {
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'] // Updated attributes
          }
        ]
      });
      if (!clientEmployee) {
        throw new Error('Client employee not found');
      }
      return clientEmployee;
    } catch (error) {
      throw new Error('Error fetching client employee: ' + error.message);
    }
  },

  async createClientEmployee(clientEmployeeData) {
    try {
      const clientEmployee = await ClientEmployee.create(clientEmployeeData);
      return clientEmployee;
    } catch (error) {
      throw new Error('Error creating client employee: ' + error.message);
    }
  },

  async updateClientEmployee(id, clientEmployeeData) {
    try {
      const clientEmployee = await ClientEmployee.findByPk(id);
      if (!clientEmployee) {
        throw new Error('Client employee not found');
      }

      await clientEmployee.update(clientEmployeeData);
      return clientEmployee;
    } catch (error) {
      throw new Error('Error updating client employee: ' + error.message);
    }
  },

  async deleteClientEmployee(id) {
    try {
      const clientEmployee = await ClientEmployee.findByPk(id);
      if (!clientEmployee) {
        throw new Error('Client employee not found');
      }
      await clientEmployee.destroy();
      return { message: 'Client employee deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting client employee: ' + error.message);
    }
  },

  async searchClientEmployees(query) {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        where: {
          [Op.or]: [
            { '$Client.ClientName$': { [Op.like]: `%${query}%` } },
            { '$Client.ClientCode$': { [Op.like]: `%${query}%` } },
            { '$Employee.FirstName$': { [Op.like]: `%${query}%` } }, // Updated
            { '$Employee.LastName$': { [Op.like]: `%${query}%` } },  // Updated
            { '$Employee.EmpCode$': { [Op.like]: `%${query}%` } }    // Updated
          ]
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'] // Updated attributes
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return clientEmployees;
    } catch (error) {
      throw new Error('Error searching client employees: ' + error.message);
    }
  },

  async getClientEmployeesByClient(clientId) {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        where: { ClientID: clientId },
        include: [
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'] // Updated attributes
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return clientEmployees;
    } catch (error) {
      throw new Error('Error fetching client employees: ' + error.message);
    }
  },

  async getClientEmployeesByEmployee(employeeId) {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        where: { EmployeeID: employeeId },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return clientEmployees;
    } catch (error) {
      throw new Error('Error fetching client employees: ' + error.message);
    }
  },

  async getClientEmployeesByStatus(status) {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        where: { Status: status },
        include: [
          {
            model: Client,
            attributes: ['ClientName', 'ClientCode']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'] // Updated attributes
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return clientEmployees;
    } catch (error) {
      throw new Error('Error fetching client employees by status: ' + error.message);
    }
  },

  async getClientEmployeeSummary() {
    try {
      const summary = await ClientEmployee.findAll({
        attributes: [
          'Status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['Status']
      });
      return summary;
    } catch (error) {
      throw new Error('Error fetching client employee summary: ' + error.message);
    }
  }
};

module.exports = clientEmployeeService;