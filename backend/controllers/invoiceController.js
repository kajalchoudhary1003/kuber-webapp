const invoiceService = require('../services/invoiceService');

exports.generateInvoices = async (req, res) => {
    try {
        const { clientIds, year, month } = req.body;
        const invoices = await invoiceService.generateInvoices(clientIds, year, month);
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error generating invoices:', error);
        res.status(500).json({ message: 'Error generating invoices' });
    }
};

exports.getGeneratedInvoices = async (req, res) => {
    try {
        const { year, month } = req.params;
        const invoices = await invoiceService.getGeneratedInvoices(year, month);
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching generated invoices:', error);
        res.status(500).json({ message: 'Error fetching generated invoices' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        await invoiceService.deleteInvoice(invoiceId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ message: 'Error deleting invoice' });
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const filePath = await invoiceService.downloadInvoice(invoiceId);
        res.status(200).sendFile(filePath);
    } catch (error) {
        console.error('Error downloading invoice:', error);
        res.status(500).json({ message: 'Error downloading invoice' });
    }
};

exports.markInvoiceAsSent = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        await invoiceService.markInvoiceAsSent(invoiceId);
        res.status(204).send();
    } catch (error) {
        console.error('Error marking invoice as sent:', error);
        res.status(500).json({ message: 'Error marking invoice as sent' });
    }
};

exports.regenerateInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        await invoiceService.regenerateInvoice(invoiceId);
        res.status(204).send();
    } catch (error) {
        console.error('Error regenerating invoice:', error);
        res.status(500).json({ message: 'Error regenerating invoice' });
    }
};

exports.viewInvoice = async (req, res) => {
    try {
        const { filePath } = req.params;
        res.status(200).sendFile(filePath);
    } catch (error) {
        console.error('Error opening invoice:', error);
        res.status(500).json({ message: 'Error opening invoice' });
    }
};
