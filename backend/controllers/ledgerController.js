const ledgerService = require('../services/ledgerService');
const logger = require('../utils/logger');

const getLedgerByClientAndDateRange = async (req, res) => {
  const { clientId, startDate, endDate } = req.query;

  try {
    const result = await ledgerService.getLedgerEntriesByClientAndDateRange(clientId, startDate, endDate);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error fetching ledger data: ${error.message}`);
    res.status(500).json({ error: 'Error fetching ledger data' });
  }
};

module.exports = {
  getLedgerByClientAndDateRange,
};
