const paymentTrackerService = require('../services/paymentTrackerService');

const createPayment = async (req, res) => {
  const { clientId, receivedDate, amount, remark } = req.body;
  try {
    const payment = await paymentTrackerService.createPayment(clientId, receivedDate, amount, remark);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getLastThreePaymentsByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    const payments = await paymentTrackerService.getLastThreePaymentsByClient(clientId);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching last three payments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getReconciliationNote = async (req, res) => {
  try {
    const note = await paymentTrackerService.getReconciliationNote();
    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching reconciliation note:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateReconciliationNote = async (req, res) => {
  const { noteContent } = req.body;
  try {
    const updatedNote = await paymentTrackerService.createOrUpdateReconciliationNote(noteContent);
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating reconciliation note:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getLastThreePaymentsByClient,
  getReconciliationNote,
  updateReconciliationNote,
};
