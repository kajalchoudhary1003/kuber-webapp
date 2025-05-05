const clientService = require('../services/clientService');

exports.createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllActiveClients = async (req, res) => {
  try {
    const clients = await clientService.getAllActiveClients();
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllInactiveClients = async (req, res) => {
  try {
    const clients = await clientService.getAllInactiveClients();
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await clientService.updateClient(req.params.id, req.body);
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const result = await clientService.deleteClient(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
