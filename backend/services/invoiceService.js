const Invoice = require('../models/invoiceModel');
const Ledger = require('../models/ledgerModel');
const BillingDetail = require('../models/billingDetailModel');
const Employee = require('../models/employeeModel');
const Client = require('../models/clientModel');
const Organisation = require('../models/organisationModel');
const BankDetail = require('../models/bankDetailModel');
const Currency = require('../models/currencyModel');
const PaymentTracker = require('../models/paymentTrackerModel');
const PdfPrinter = require('pdfmake');
const os = require('os');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const recalculateBalanceFromStart = async (clientId, session) => {
  const ledgerEntries = await Ledger.find({ 
    clientId: clientId 
  }).sort({ date: 1 }).session(session);
  
  const paymentEntries = await PaymentTracker.find({ 
    clientId: clientId 
  }).sort({ receivedDate: 1 }).session(session);
  
  const combinedEntries = [
    ...ledgerEntries.map(entry => ({
      type: 'Invoice',
      date: entry.date,
      amount: entry.amount,
      _id: entry._id
    })),
    ...paymentEntries.map(entry => ({
      type: 'Payment',
      date: entry.receivedDate,
      amount: entry.amount,
      _id: entry._id
    })),
  ];
  
  combinedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let balance = 0;
  for (const entry of combinedEntries) {
    if (entry.type === 'Invoice') {
      balance += parseFloat(entry.amount);
    } else if (entry.type === 'Payment') {
      balance -= parseFloat(entry.amount);
    }
    
    if (entry.type === 'Invoice') {
      await Ledger.findByIdAndUpdate(
        entry._id,
        { balance: balance },
        { session }
      );
    }
  }
};

const generateDocDefinition = (client, year, month, employeeDetails, totalAmount, logoBase64) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  return {
    pageMargins: [40, 100, 40, 24],
    header: {
      margin: [40, 40, 40, 20],
      stack: [
        {
          columns: [
            {
              image: `data:image/png;base64,${logoBase64}`,
              width: 124,
              height: 24,
            },
            {
              text: [
                { text: 'Reg. No:', style: 'regNoLabel' },
                { text: ` ${client.organisation.regNumber}`, style: 'regNoValue' }
              ],
              alignment: 'right',
              color: '#0E1866',
            }
          ]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 515,
              y2: 10,
              lineWidth: 1,
              lineColor: '#d3d3d3',
            },
          ],
          margin: [0, 10, 0, 10]
        }
      ]
    },
    content: [
      { text: 'INVOICE', style: 'invoiceTitle' },
      {
        columns: [
          { text: 'Project:', style: 'subheaderKey', width: 160 },
          { text: client.clientName, style: 'subheaderValue' }
        ],
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          { text: 'Invoice number:', style: 'subheaderKey', width: 160 },
          { text: `${client.organisation.abbreviation}${year}${month}_${client._id}`, style: 'subheaderValue' }
        ],
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          { text: 'Invoice Date:', style: 'subheaderKey', width: 160 },
          { text: `${new Date().toLocaleDateString()}`, style: 'subheaderValue' }
        ],
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          { text: 'Payment Due Date:', style: 'subheaderKey', width: 160 },
          { text: `${new Date().toLocaleDateString()}`, style: 'subheaderValue' }
        ],
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          { text: 'Invoiced to:', style: 'subheaderKey', width: 160 },
          {
            text: [
              { text: client.clientName, bold: true },
              { text: `, ${client.registeredAddress}`, bold: false }
            ],
            style: 'subheaderValue',
            margin: [0, 0, 0, 10]
          }
        ]
      },
      {
        columns: [
          { text: 'Invoice Period:', style: 'subheaderKey', width: 160 },
          { text: `${firstDay.toLocaleDateString()} to ${lastDay.toLocaleDateString()}`, style: 'subheaderValue' }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        style: 'table',
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Services', style: 'tableHeaderService', fillColor: '#F7F7F7' },
              { text: `Cost (${client.billingCurrency.currencyCode})`, style: 'tableHeaderCost', fillColor: '#F7F7F7' }
            ],
            ...employeeDetails.map(detail => [
              { text: detail.name, style: 'tableContentService' },
              { text: detail.amount, style: 'tableContentCost' }
            ]),
            [
              { text: 'Total', style: 'tableContentService', color: '#048DFF' },
              { text: totalAmount.toString(), style: 'tableContentCost', color: '#048DFF' }
            ],
            [
              { text: 'Last Month Balance', style: 'tableContentService' },
              { text: '200', style: 'tableContentCost' }, // Example, should be dynamic
            ],
            [
              { text: 'Total Due', style: 'tableContentService', fillColor: '#048DFF', color: '#ffffff' },
              { text: `${client.billingCurrency.currencyCode} ${totalAmount}`, style: 'tableContentCost', fillColor: '#048DFF', color: '#ffffff' }
            ]
          ]
        },
        layout: {
          paddingLeft: function (i, node) { return 12; },
          paddingRight: function (i, node) { return 12; },
          paddingTop: function (i, node) { return 6; },
          paddingBottom: function (i, node) { return 6; },
          fillColor: function (rowIndex, node, columnIndex) {
            return (rowIndex === 0) ? '#F7F7F7' : null;
          },
          hLineWidth: function (i, node) { return 0; },
          vLineWidth: function (i, node) { return 0; }
        },
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Payment details',
        style: 'tableHeader',
        alignment: 'center',
        margin: [0, 20, 0, 10]
      },
      {
        table: {
          widths: ['18%', '32%', '18%', '32%'],
          body: [
            [
              { text: 'Payee name:', style: 'cardLabel', border: [false, false, false, false] },
              { text: client.organisation.organisationName, style: 'cardValue', colSpan: 3, border: [false, false, false, false], margin: [0, 0, 0, 0] },
              {}, {}
            ],
            [
              { text: 'Swift code:', style: 'cardLabel', border: [false, false, false, false] },
              { text: client.bankDetail.swiftCode, style: 'cardValue', border: [false, false, false, false] },
              { text: 'Account No:', style: 'cardLabel', border: [false, false, false, false] },
              { text: client.bankDetail.accountNumber, style: 'cardValue', border: [false, false, false, false] },
            ],
            [
              { text: 'Bank:', style: 'cardLabel', border: [false, false, false, false] },
              { text: client.bankDetail.bankName, style: 'cardValue', border: [false, false, false, false] },
              { text: 'IFSC code:', style: 'cardLabel', border: [false, false, false, false] },
              { text: client.bankDetail.ifscCode, style: 'cardValue', border: [false, false, false, false] },
            ]
          ]
        },
        fillColor: '#EDF7FF',
        layout: {
          paddingLeft: function (i, node) { return 16; },
          paddingRight: function (i, node) { return 16; },
          paddingTop: function (i, node) { return 8; },
          paddingBottom: function (i, node) { return 8; },
          hLineWidth: function (i, node) { return 0; },
          vLineWidth: function (i, node) { return 0; }
        },
        unbreakable: true,
      },
    ],
    footer: {
      stack: [
        {
          table: {
            widths: ['100%'],
            heights: [30],
            body: [
              [
                {
                  text: 'A-13A Graphix tower, Sec-62, Noida',
                  style: 'footerText',
                  alignment: 'center',
                  margin: [0, 3, 0, 0],
                  border: [false, false, false, false],
                  fillColor: '#002366',
                }
              ]
            ]
          },
          layout: 'noBorders'
        }
      ],
    },
    styles: {
      header: {
        color: '#1F271B',
        fontSize: 18,
        bold: true,
      },
      subheader: {
        color: '#1F271B',
        fontSize: 12,
        margin: [0, 10, 0, 5],
      },
      subheaderKey: {
        color: '#1F271B',
        fontSize: 12,
        bold: true,
      },
      subheaderValue: {
        color: '#1F271B',
        fontSize: 12,
      },
      invoiceTitle: {
        fontSize: 16,
        color: '#1F271B',
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      tableHeaderService: {
        color: '#1F271B',
        bold: true,
        fontSize: 12,
        alignment: 'left',
      },
      tableHeaderCost: {
        color: '#1F271B',
        bold: true,
        fontSize: 12,
        alignment: 'right',
      },
      tableContentService: {
        color: '#1F271B',
        fontSize: 12,
        alignment: 'left',
      },
      tableContentCost: {
        color: '#1F271B',
        fontSize: 12,
        alignment: 'right',
      },
      footerText: {
        fontSize: 12,
        alignment: 'center',
        color: '#ffffff',
      },
      regNoLabel: {
        font: 'Roboto',
        bold: true,
        fontSize: 12,
        lineHeight: 1.5,
      },
      regNoValue: {
        font: 'Roboto',
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 1.5,
      },
      cardLabel: {
        fontSize: 12,
        bold: true,
        color: '#1F271B',
      },
      cardValue: {
        fontSize: 12,
        color: '#1F271B',
      }
    },
    defaultStyle: {
      columnGap: 20
    }
  };
};

const generateInvoices = async (clientIds, year, month) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const invoices = [];
      
      for (const clientId of clientIds) {
        // Delete existing invoices for this client/month/year
        await Invoice.deleteMany({
          clientId: clientId,
          year: month <= 3 ? year + 1 : year,
          month: month
        }).session(session);
        
        // Get billing details
        const billingDetails = await BillingDetail.find({
          clientId: clientId,
          year: year
        }).populate('employee').session(session);
        
        let totalAmount = 0;
        const employeeDetails = billingDetails.map(billingDetail => {
          const amount = billingDetail[monthNames[month - 1].toLowerCase()];
          if (parseFloat(amount || 0) <= 0) {
            return null;
          }
          totalAmount += parseFloat(amount || 0);
          return {
            name: `${billingDetail.employee.firstName} ${billingDetail.employee.lastName}`,
            amount,
          };
        }).filter(detail => detail !== null);
        
        // Get client with related data
        const client = await Client.findById(clientId)
          .populate('organisation')
          .populate('bankDetail')
          .populate('billingCurrency')
          .session(session);
        
        const invoiceYear = month <= 3 ? year + 1 : year;
        const lastDayOfMonth = new Date(invoiceYear, month, 0);
        
        // Create invoice
        const invoice = await Invoice.create([{
          clientId: clientId,
          month: month,
          year: invoiceYear,
          totalAmount: totalAmount,
          organisationId: client.organisationId,
          bankDetailId: client.bankDetailId,
          status: 'Invoice generated',
          generatedOn: new Date(),
          invoicedOn: lastDayOfMonth,
        }], { session });
        
        // Generate PDF
        const logoPath = path.join(__dirname, '../utils/logo/CVT_logo.png');
        const logoBase64 = fs.readFileSync(logoPath, 'base64');
        
        const docDefinition = generateDocDefinition(client, invoiceYear, month, employeeDetails, totalAmount, logoBase64);
        
        // Create PDF
        const printer = new PdfPrinter({
          Roboto: {
            normal: path.join(__dirname, '../utils/fonts/Roboto-Regular.ttf'),
            bold: path.join(__dirname, '../utils/fonts/Roboto-Medium.ttf'),
            italics: path.join(__dirname, '../utils/fonts/Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, '../utils/fonts/Roboto-MediumItalic.ttf')
          }
        });
        
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        const invoiceFilePath = path.join(downloadsPath, `Invoice_${clientId}_${invoiceYear}_${month}.pdf`);
        
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const writeStream = fs.createWriteStream(invoiceFilePath);
        pdfDoc.pipe(writeStream);
        
        await new Promise((resolve, reject) => {
          pdfDoc.end();
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        
        // Update invoice with PDF path
        invoice[0].pdfPath = invoiceFilePath;
        await invoice[0].save({ session });
        
        // Create ledger entry
        const particulars = `Invoice Raised for ${monthNames[month - 1]}, ${invoiceYear}`;
        await Ledger.create([{
          clientId: clientId,
          date: invoice[0].generatedOn,
          amount: invoice[0].totalAmount,
          balance: 0,
          particulars: particulars,
        }], { session });
        
        await recalculateBalanceFromStart(clientId, session);
        invoices.push(invoice[0]);
      }
      
      await session.commitTransaction();
      return invoices;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error generating invoices: ${error.message}`);
    } finally {
      session.endSession();
    }
  };
  
const getGeneratedInvoices = async (year, month) => {
    try {
      const invoiceYear = month <= 3 ? year + 1 : year;
      
      // Get all clients
      const allClients = await Client.find().populate('billingCurrency');
      
      // Get invoices for the specified month/year
      const invoices = await Invoice.find({
        year: invoiceYear,
        month: month,
      }).populate({
        path: 'clientId',
        populate: {
          path: 'billingCurrency'
        }
      });
      
      const simplifiedInvoices = invoices.map(invoice => ({
        id: invoice._id,
        clientId: invoice.clientId._id,
        clientName: invoice.clientId.clientName,
        totalAmount: invoice.totalAmount,
        currencyCode: invoice.clientId.billingCurrency.currencyCode,
        generatedOn: invoice.generatedOn,
        invoicedOn: invoice.invoicedOn,
        status: invoice.status,
        pdfPath: invoice.pdfPath,
      }));
      
      // Create a set of client IDs that have invoices
      const clientsWithInvoices = new Set(simplifiedInvoices.map(inv => inv.clientId.toString()));
      
      // For all clients, return invoice data if exists, otherwise return "Not generated yet"
      const allClientsWithStatus = allClients.map(client => {
        const invoice = simplifiedInvoices.find(inv => inv.clientId.toString() === client._id.toString());
        return invoice ? invoice : {
          id: null,
          clientId: client._id,
          clientName: client.clientName,
          totalAmount: 0,
          currencyCode: client.billingCurrency?.currencyCode || 'N/A',
          generatedOn: null,
          invoicedOn: null,
          status: "Not generated yet",
          pdfPath: null,
        };
      });
      
      return allClientsWithStatus;
    } catch (error) {
      throw new Error(`Error fetching invoices: ${error.message}`);
    }
  };
  
const deleteInvoice = async (invoiceId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const invoice = await Invoice.findById(invoiceId).session(session);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // Delete the ledger entry
      await Ledger.deleteOne({
        clientId: invoice.clientId,
        date: invoice.generatedOn,
      }).session(session);
      
      // Delete the invoice
      await Invoice.findByIdAndDelete(invoiceId).session(session);
      
      // Recalculate balance
      await recalculateBalanceFromStart(invoice.clientId, session);
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error deleting invoice: ${error.message}`);
    } finally {
      session.endSession();
    }
  };
  
const downloadInvoice = async (invoiceId) => {
    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // Return the path to the PDF file
      return invoice.pdfPath;
    } catch (error) {
      throw new Error(`Error downloading invoice: ${error.message}`);
    }
  };
  
const markInvoiceAsSent = async (invoiceId) => {
    try {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      invoice.status = 'Sent to client';
      await invoice.save();
    } catch (error) {
      throw new Error(`Error marking invoice as sent: ${error.message}`);
    }
  };
  
const regenerateInvoice = async (invoiceId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const invoice = await Invoice.findById(invoiceId).session(session);
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      // Recalculate the invoice amount
      const billingDetails = await BillingDetail.find({
        clientId: invoice.clientId,
        year: invoice.year - (invoice.month <= 3 ? 1 : 0)
      }).populate('employee').session(session);
      
      let newAmount = 0;
      billingDetails.forEach(billingDetail => {
        const amount = billingDetail[monthNames[invoice.month - 1].toLowerCase()];
        if (parseFloat(amount || 0) > 0) {
          newAmount += parseFloat(amount || 0);
        }
      });
      
      // Update the ledger entry
      await Ledger.findOneAndUpdate(
        {
          clientId: invoice.clientId,
          date: invoice.generatedOn,
        },
        {
          amount: newAmount,
        },
        { session }
      );
      
      // Recalculate balance
      await recalculateBalanceFromStart(invoice.clientId, session);
      
      // Update the invoice
      invoice.totalAmount = newAmount;
      invoice.generatedOn = new Date();
      await invoice.save({ session });
      
      // Regenerate the PDF
      const client = await Client.findById(invoice.clientId)
        .populate('organisation')
        .populate('bankDetail')
        .populate('billingCurrency')
        .session(session);
      
      const employeeDetails = billingDetails.map(billingDetail => {
        const amount = billingDetail[monthNames[invoice.month - 1].toLowerCase()];
        if (parseFloat(amount || 0) <= 0) {
          return null;
        }
        return {
          name: `${billingDetail.employee.firstName} ${billingDetail.employee.lastName}`,
          amount,
        };
      }).filter(detail => detail !== null);
      
      const logoPath = path.join(__dirname, '../utils/logo/CVT_logo.png');
      const logoBase64 = fs.readFileSync(logoPath, 'base64');
      
      const docDefinition = generateDocDefinition(client, invoice.year, invoice.month, employeeDetails, newAmount, logoBase64);
      
      const printer = new PdfPrinter({
        Roboto: {
          normal: path.join(__dirname, '../utils/fonts/Roboto-Regular.ttf'),
          bold: path.join(__dirname, '../utils/fonts/Roboto-Medium.ttf'),
          italics: path.join(__dirname, '../utils/fonts/Roboto-Italic.ttf'),
          bolditalics: path.join(__dirname, '../utils/fonts/Roboto-MediumItalic.ttf')
        }
      });
      
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const invoiceFilePath = path.join(downloadsPath, `Invoice_${invoice.clientId}_${invoice.year}_${invoice.month}.pdf`);
      
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const writeStream = fs.createWriteStream(invoiceFilePath);
      pdfDoc.pipe(writeStream);
      
      await new Promise((resolve, reject) => {
        pdfDoc.end();
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      
      // Update invoice with new PDF path
      invoice.pdfPath = invoiceFilePath;
      await invoice.save({ session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Error regenerating invoice: ${error.message}`);
    } finally {
      session.endSession();
    }
  };
  
  module.exports = {
    generateInvoices,
    getGeneratedInvoices,
    deleteInvoice,
    downloadInvoice,
    markInvoiceAsSent,
    regenerateInvoice,
  };
  