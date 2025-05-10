const { Op } = require('sequelize');
const Client = require('../models/clientModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const Currency = require('../models/currencyModel');
const Organisation = require('../models/organisationModel');
const BankDetail = require('../models/bankDetailModel');

const clientService = {
  async getAllClients() {
    try {
      const clients = await Client.findAll({
        include: [
          { model: Organisation, as: 'Organisation' },
          { model: BankDetail, as: 'BankDetail' },
          { model: Currency, as: 'BillingCurrency' }
        ]
      });
      return clients;
    } catch (error) {
      throw new Error(`Error fetching clients: ${error.message}`);
    }
  },

  async getClientById(id) {
    try {
      const client = await Client.findByPk(id, {
        include: [
          { model: Organisation, as: 'Organisation' },
          { model: BankDetail, as: 'BankDetail' },
          { model: Currency, as: 'Currency' }
        ]
      });
      if (!client) {
        throw new Error('Client not found');
      }
      return client;
    } catch (error) {
      throw new Error(`Error fetching client: ${error.message}`);
    }
  },

  async createClient(clientData) {
    try {
      const client = await Client.create(clientData);
      return client;
    } catch (error) {
      throw new Error(`Error creating client: ${error.message}`);
    }
  },

  async updateClient(id, clientData) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }
      await client.update(clientData);
      return client;
    } catch (error) {
      throw new Error(`Error updating client: ${error.message}`);
    }
  },

  async deleteClient(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Client not found');
      }
      await client.destroy();
      return { message: 'Client deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting client: ${error.message}`);
    }
  },

  async searchClients(query) {
    try {
      const clients = await Client.findAll({
        where: {
          [Op.or]: [
            { ClientName: { [Op.like]: `%${query}%` } },
            { Abbreviation: { [Op.like]: `%${query}%` } },
            { ContactPerson: { [Op.like]: `%${query}%` } },
            { Email: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          { model: Organisation, as: 'Organisation' },
          { model: BankDetail, as: 'BankDetail' },
          { model: Currency, as: 'Currency' }
        ]
      });
      return clients;
    } catch (error) {
      throw new Error(`Error searching clients: ${error.message}`);
    }
  },

  async getAllActiveClients() {
    try {
      const activeClientIds = await ClientEmployee.findAll({
        where: { Status: 'Active' },
        attributes: ['ClientID'],
        group: ['ClientID']
      });

      const clientIds = activeClientIds.map(ce => ce.ClientID);
      
      const clients = await Client.findAll({
        where: { id: clientIds },
        include: [
          { model: Organisation, as: 'Organisation' },
          { model: BankDetail, as: 'BankDetail' },
          { model: Currency, as: 'Currency' }
        ]
      });
      
      return clients;
    } catch (error) {
      throw new Error(`Error fetching active clients: ${error.message}`);
    }
  },

  async getAllInactiveClients() {
    try {
      const inactiveClientIds = await ClientEmployee.findAll({
        where: { Status: 'Inactive' },
        attributes: ['ClientID'],
        group: ['ClientID']
      });

      const clientIds = inactiveClientIds.map(ce => ce.ClientID);
      
      const clients = await Client.findAll({
        where: { id: clientIds },
        include: [
          { model: Organisation, as: 'Organisation' },
          { model: BankDetail, as: 'BankDetail' },
          { model: Currency, as: 'Currency' }
        ]
      });
      
      return clients;
    } catch (error) {
      throw new Error(`Error fetching inactive clients: ${error.message}`);
    }
  }
};

module.exports = clientService;
