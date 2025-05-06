const roleService = require('../services/roleService');
const logger = require('../utils/logger');

// Controller methods to interact with the role service

// Create a role
const createRole = async (req, res) => {
  try {
    logger.info('Create role service called');
    const role = await roleService.createRole(req.body); // Getting data from request body
    return res.status(201).json(role); // Return the created role with a 201 status
  } catch (error) {
    logger.error(`Error creating role: ${error.message}`);
    return res.status(500).json({ message: error.message }); // Return error message if any
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    logger.info('Get all roles service called');
    const roles = await roleService.getAllRoles();
    return res.status(200).json(roles); // Return all roles
  } catch (error) {
    logger.error(`Error fetching roles: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// Update a role by ID
const updateRole = async (req, res) => {
  try {
    const { roleId, updates } = req.body; // Extract roleId and updates from request body
    logger.info(`Update role service called for roleId: ${roleId}`);
    const updatedRole = await roleService.updateRole(roleId, updates);
    return res.status(200).json(updatedRole); // Return updated role
  } catch (error) {
    logger.error(`Error updating role: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a role by ID
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params; // Get roleId from URL parameter
    logger.info(`Delete role service called for roleId: ${roleId}`);
    const result = await roleService.deleteRole(roleId);
    return res.status(200).json(result); // Return result of the deletion
  } catch (error) {
    logger.error(`Error deleting role: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
};
