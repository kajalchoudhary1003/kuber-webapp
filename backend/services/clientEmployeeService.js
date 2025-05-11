// clientEmployeeService.js
const { Op } = require('sequelize');
const ClientEmployee = require('../models/clientEmployeeModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');
const Role = require('../models/roleModel');
const Level = require('../models/levelModel');
const Organisation = require('../models/organisationModel');
const Currency = require('../models/currencyModel'); // Add this if Currency model exists

const clientEmployeeService = {
  async getAllClientEmployees() {
    try {
      const clientEmployees = await ClientEmployee.findAll({
        include: [
          {
            model: Client,
            attributes: ['ClientName']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: 'Organisation', attributes: ['Abbreviation'] }
            ]
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
            attributes: ['ClientName']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: 'Organisation', attributes: ['Abbreviation'] }
            ]
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
            { '$Employee.FirstName$': { [Op.like]: `%${query}%` } },
            { '$Employee.LastName$': { [Op.like]: `%${query}%` } },
            { '$Employee.EmpCode$': { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: Client,
            attributes: ['ClientName']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: ' alliances', attributes: ['Abbreviation'] }
            ]
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
      // Validate client existence
      const client = await Client.findByPk(clientId);
      if (!client) {
        throw new Error('Client not found');
      }

      const clientEmployees = await ClientEmployee.findAll({
        where: { ClientID: clientId },
        include: [
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: 'Organisation', attributes: ['Abbreviation'] }
            ]
          },
          {
            model: Client,
            attributes: ['ClientName'],
            include: [
              { model: Currency, as: 'BillingCurrency', attributes: ['CurrencyName', 'CurrencyCode'] } // Include if Currency exists
            ]
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
            attributes: ['ClientName']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: 'Organisation', attributes: ['Abbreviation'] }
            ]
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
            attributes: ['ClientName']
          },
          {
            model: Employee,
            attributes: ['FirstName', 'LastName', 'EmpCode'],
            include: [
              { model: Role, as: 'Role', attributes: ['RoleName'] },
              { model: Level, as: 'Level', attributes: ['LevelName'] },
              { model: Organisation, as: 'Organisation', attributes: ['Abbreviation'] }
            ]
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