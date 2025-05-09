const ledgerService = require('../services/ledgerService');
const logger = require('../utils/logger');

const ledgerController = {
  async getLedgerByClientAndDateRange(req, res) {
    const { clientId, startDate, endDate } = req.query;

    try {
      const result = await ledgerService.getLedgerEntriesByClientAndDateRange(clientId, startDate, endDate);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error fetching ledger data: ${error.message}`);
      res.status(500).json({ error: 'Error fetching ledger data' });
    }
  },

  async getAllLedgerEntries(req, res) {
    try {
      const ledgerEntries = await ledgerService.getAllLedgerEntries();
      res.json(ledgerEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLedgerEntryById(req, res) {
    try {
      const ledgerEntry = await ledgerService.getLedgerEntryById(req.params.id);
      res.json(ledgerEntry);
    } catch (error) {
      if (error.message === 'Ledger entry not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createLedgerEntry(req, res) {
    try {
      const ledgerEntry = await ledgerService.createLedgerEntry(req.body);
      res.status(201).json(ledgerEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateLedgerEntry(req, res) {
    try {
      const ledgerEntry = await ledgerService.updateLedgerEntry(req.params.id, req.body);
      res.json(ledgerEntry);
    } catch (error) {
      if (error.message === 'Ledger entry not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteLedgerEntry(req, res) {
    try {
      const result = await ledgerService.deleteLedgerEntry(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Ledger entry not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchLedgerEntries(req, res) {
    try {
      const ledgerEntries = await ledgerService.searchLedgerEntries(req.query.q);
      res.json(ledgerEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getClientLedgerEntries(req, res) {
    try {
      const ledgerEntries = await ledgerService.getClientLedgerEntries(req.params.clientId);
      res.json(ledgerEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLedgerEntriesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
      const ledgerEntries = await ledgerService.getLedgerEntriesByDateRange(startDate, endDate);
      res.json(ledgerEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLedgerEntriesByType(req, res) {
    try {
      const { type } = req.params;
      const ledgerEntries = await ledgerService.getLedgerEntriesByType(type);
      res.json(ledgerEntries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLedgerSummary(req, res) {
    try {
      const summary = await ledgerService.getLedgerSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ledgerController;
