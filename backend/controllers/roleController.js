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
    if (error.message === 'Role with this name already exists') {
      return res.status(409).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
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
    return res.status(500).json({ error: error.message });
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
    if (error.message === 'Role not found') {
      return res.status(404).json({ error: error.message });
    } else if (error.message === 'Role with this name already exists') {
      return res.status(409).json({ error: error.message });
    } else {
      return res.status(400).json({ error: error.message });
    }
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
    if (error.message === 'Role not found') {
      return res.status(404).json({ error: error.message });
    } else if (error.message === 'Cannot delete role as it is assigned to employees') {
      return res.status(409).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

// Search roles
const searchRoles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const roles = await roleService.searchRoles(query);
    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get role employees
const getRoleEmployees = async (req, res) => {
  try {
    const employees = await roleService.getRoleEmployees(req.params.id);
    return res.json(employees);
  } catch (error) {
    if (error.message === 'Role not found') {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

const roleController = {
  async getAllRoles(req, res) {
    try {
      const roles = await roleService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRoleById(req, res) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.json(role);
    } catch (error) {
      if (error.message === 'Role not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createRole(req, res) {
    try {
      const role = await roleService.createRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      if (error.message === 'Role name already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async updateRole(req, res) {
    try {
      const role = await roleService.updateRole(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      if (error.message === 'Role not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Role name already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteRole(req, res) {
    try {
      const result = await roleService.deleteRole(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Role not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Cannot delete role as it is assigned to one or more employees') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchRoles(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const roles = await roleService.searchRoles(query);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRoleEmployees(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }
      const employees = await roleService.getRoleEmployees(id);
      res.json(employees);
    } catch (error) {
      if (error.message === 'Role not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = roleController;
