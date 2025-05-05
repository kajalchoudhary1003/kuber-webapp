const Client = require('../models/clientModel');
const ClientEmployee = require('../models/clientEmployeeModel');
const Currency = require('../models/currencyModel');
const Organisation = require('../models/organisationModel');
const BankDetail = require('../models/bankDetailModel');

const createClient = async (data) => {
  const existing = await Client.findOne({ ClientName: data.ClientName, deletedAt: { $exists: false } });
  if (existing) throw new Error('Client with the same name already exists');

  const client = await Client.create(data);
  return client;
};

const getAllClients = async () => {
  return await Client.find()
    .populate('BillingCurrency', 'CurrencyName CurrencyCode');
};

const getAllActiveClients = async () => {
  const clientIds = await ClientEmployee.find({ Status: 'Active' }).distinct('ClientID');
  return await Client.find({ _id: { $in: clientIds } })
    .populate('BillingCurrency', 'CurrencyName CurrencyCode');
};

const getAllInactiveClients = async () => {
  const clientIds = await ClientEmployee.find({ Status: 'Inactive' }).distinct('ClientID');
  return await Client.find({ _id: { $in: clientIds } })
    .populate('BillingCurrency', 'CurrencyName CurrencyCode');
};

const updateClient = async (clientId, updates) => {
  const existing = await Client.findOne({ ClientName: updates.ClientName, _id: { $ne: clientId }, deletedAt: { $exists: false } });
  if (existing) throw new Error('Client with the same name already exists');

  const updated = await Client.findByIdAndUpdate(clientId, updates, { new: true });
  if (!updated) throw new Error('Client not found');
  return updated;
};

const deleteClient = async (clientId) => {
  const client = await Client.findById(clientId);
  if (!client) throw new Error('Client not found');

  const activeEmployees = await ClientEmployee.find({ ClientID: clientId, Status: 'Active' });
  if (activeEmployees.length > 0) {
    throw new Error('Cannot delete client with active employee associations');
  }

  await ClientEmployee.deleteMany({ ClientID: clientId });
  await Client.findByIdAndDelete(clientId);

  return { message: 'Client and associated employees deleted successfully' };
};

const getClientById = async (clientId) => {
  const client = await Client.findById(clientId)
    .populate('BillingCurrency', 'CurrencyName CurrencyCode')
    .populate('Organisation', 'OrganisationName')
    .populate('BankDetail', 'BankName');

  if (!client) throw new Error('Client not found');
  return client;
};

module.exports = {
  createClient,
  getAllClients,
  getAllActiveClients,
  getAllInactiveClients,
  updateClient,
  deleteClient,
  getClientById,
};
