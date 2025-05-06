const Role = require('../models/roleModel'); // Mongoose model for Role
const logger = require('../utils/logger');

// Service methods to interact with the database

// Create a new role
const createRole = async (roleData) => {
  try {
    const role = new Role(roleData); // Creating a new role instance
    await role.save(); // Save the role to the database
    return role;
  } catch (error) {
    logger.error(`Error creating role: ${error.message}`);
    throw new Error(`Error creating role: ${error.message}`);
  }
};

// Get all roles
const getAllRoles = async () => {
  try {
    const roles = await Role.find(); // Fetch all roles from the database
    logger.info(`Received Roles data: ${JSON.stringify(roles)}`);
    return roles;
  } catch (error) {
    logger.error(`Error fetching roles: ${error.message}`);
    throw new Error(`Error fetching roles: ${error.message}`);
  }
};

// Update a role by ID
const updateRole = async (roleId, updates) => {
  try {
    const role = await Role.findById(roleId); // Find the role by ID
    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }
    Object.assign(role, updates); // Apply updates to the role
    await role.save(); // Save the updated role
    return role;
  } catch (error) {
    logger.error(`Error updating role: ${error.message}`);
    throw new Error(`Error updating role: ${error.message}`);
  }
};

// Delete a role by ID
const deleteRole = async (roleId) => {
  try {
    const role = await Role.findById(roleId); // Find the role by ID
    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }
    await role.remove(); // Delete the role
    return { message: 'Role deleted successfully' };
  } catch (error) {
    logger.error(`Error deleting role: ${error.message}`);
    throw new Error(`Error deleting role: ${error.message}`);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
};
