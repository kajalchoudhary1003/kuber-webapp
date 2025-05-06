const organisationService = require('../services/organisationService');
const logger = require('../utils/logger');

const createOrganisation = async (req, res) => {
  try {
    logger.info('Create organisation service called');
    const organisation = await organisationService.createOrganisation(req.body);
    res.status(201).json(organisation);
  } catch (error) {
    logger.error(`Error creating organisation: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getAllOrganisations = async (req, res) => {
  try {
    logger.info('Get all organisations service called');
    const organisations = await organisationService.getAllOrganisations();
    res.status(200).json(organisations);
  } catch (error) {
    logger.error(`Error fetching organisations: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const updateOrganisation = async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Update organisation service called for id: ${id}`);
    const updatedOrganisation = await organisationService.updateOrganisation(id, req.body);
    res.status(200).json(updatedOrganisation);
  } catch (error) {
    logger.error(`Error updating organisation: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const deleteOrganisation = async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Delete organisation service called for id: ${id}`);
    const result = await organisationService.deleteOrganisation(id);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error deleting organisation: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrganisation,
  getAllOrganisations,
  updateOrganisation,
  deleteOrganisation,
};
