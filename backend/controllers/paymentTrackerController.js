const paymentTrackerService = require('../services/paymentTrackerService');
const logger = require('../utils/logger');

const paymentTrackerController = {
  async getAllPayments(req, res) {
    try {
      const payments = await paymentTrackerService.getAllPayments();
      res.json(payments);
    } catch (error) {
      logger.error(`Error fetching payments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentById(req, res) {
    try {
      const payment = await paymentTrackerService.getPaymentById(req.params.id);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Error fetching payment: ${error.message}`);
        res.status(500).json({ error: error.message });
      }
    }
  },

  async createPayment(req, res) {
    try {
      const payment = await paymentTrackerService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      logger.error(`Error creating payment: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  async updatePayment(req, res) {
    try {
      const payment = await paymentTrackerService.updatePayment(req.params.id, req.body);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Error updating payment: ${error.message}`);
        res.status(400).json({ error: error.message });
      }
    }
  },

  async deletePayment(req, res) {
    try {
      const result = await paymentTrackerService.deletePayment(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Payment not found') {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Error deleting payment: ${error.message}`);
        res.status(500).json({ error: error.message });
      }
    }
  },

  async searchPayments(req, res) {
    try {
      const payments = await paymentTrackerService.searchPayments(req.query.q);
      res.json(payments);
    } catch (error) {
      logger.error(`Error searching payments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getClientPayments(req, res) {
    try {
      const payments = await paymentTrackerService.getClientPayments(req.params.clientId);
      res.json(payments);
    } catch (error) {
      logger.error(`Error fetching client payments: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
      const payments = await paymentTrackerService.getPaymentsByDateRange(startDate, endDate);
      res.json(payments);
    } catch (error) {
      logger.error(`Error fetching payments by date range: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsByStatus(req, res) {
    try {
      const { status } = req.params;
      const payments = await paymentTrackerService.getPaymentsByStatus(status);
      res.json(payments);
    } catch (error) {
      logger.error(`Error fetching payments by status: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsSummary(req, res) {
    try {
      const summary = await paymentTrackerService.getPaymentsSummary();
      res.json(summary);
    } catch (error) {
      logger.error(`Error fetching payments summary: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentsByInvoice(req, res) {
    try {
      const payments = await paymentTrackerService.getPaymentsByInvoice(req.params.invoiceId);
      res.json(payments);
    } catch (error) {
      logger.error(`Error fetching payments by invoice: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = paymentTrackerController;
