const path = require('path');
const fs = require('fs');
const PdfPrinter = require('pdfmake');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const loadFonts = () => ({
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
});

const loadLogo = () => {
  try {
    const logoPath = path.join(__dirname, './logo/CVT_logo.png');
    if (fs.existsSync(logoPath)) {
      return fs.readFileSync(logoPath, 'base64');
    }
    return ''; // Return empty string if logo doesn't exist
  } catch (error) {
    console.warn('Logo file not found, using empty logo');
    return '';
  }
};

const createInvoicePdf = async (invoiceData, employeeDetails, invoiceFilePath) => {
  const { clientId, year, month, totalAmount, logoBase64 } = invoiceData;
  const docDefinition = {
    pageMargins: [40, 100, 40, 60],
    header: [
      {
        absolutePosition: { x: 40, y: 40 },
        image: `data:image/png;base64,${logoBase64}`,
        width: 124,
        height: 24,
      },
      {
        absolutePosition: { x: 352, y: 46 },
        text: 'Reg. No:',
        style: 'regNoLabel',
      },
      {
        absolutePosition: { x: 406, y: 46 },
        text: 'U72200DL2013PTC249807',
        style: 'regNoValue',
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 38,
            y1: 80,
            x2: 560, // Page width - page margins
            y2: 80,
            lineWidth: 1,
            lineColor: '#d3d3d3', // Light grey color
          },
        ],
      },
    ],
    content: [
      { text: 'INVOICE', style: 'invoiceTitle' },
      { text: `Project: Over - C Product Dev & Support`, style: 'subheader' },
      { text: `Invoice number: CVT${year}${month}_${clientId}`, style: 'subheader' },
      { text: `Invoice Date: ${new Date().toLocaleDateString()}`, style: 'subheader' },
      { text: `Payment Due Date: ${new Date().toLocaleDateString()}`, style: 'subheader' },
      { text: `Invoiced to: RISKTECH LIMITED`, style: 'subheader' },
      { text: `Dromlena, 4 Rockboro Avenue, Old Blackrock Road, Cork, T 12 YY9X`, style: 'subheader' },
      { text: `Invoiced to: 1 ${monthNames[month - 1]} ${year} to 31 ${monthNames[month - 1]} ${year}`, style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          body: [
            [{ text: 'Services', style: 'tableHeader' }, { text: 'Cost (£)', style: 'tableHeader' }],
            ...employeeDetails.map(detail => [detail.name, detail.amount]),
            [{ text: 'Last Month Balance for 2nd half of March', colSpan: 1 }, { text: '200' }],
            [{ text: 'Total', colSpan: 1, style: 'totalCell' }, { text: totalAmount.toString(), style: 'totalCell' }],
            [{ text: 'Advance payment', colSpan: 1 }, { text: '-' }],
            [{ text: 'Total Due GBP', colSpan: 1, style: 'totalDue' }, { text: `£ ${totalAmount}`, style: 'totalDue' }],
          ]
        },
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'Payment details', style: 'tableHeader' }],
            [{ text: 'Payee name: Core Value Technologies Pvt Ltd', style: 'tableContent' }],
            [{ text: 'Bank: ICICI Bank', style: 'tableContent' }],
            [{ text: 'Account No: 1234546578', style: 'tableContent' }],
            [{ text: 'Swift code: ICICIINBBCTS', style: 'tableContent' }],
            [{ text: 'IFSC code: ICIC0000456', style: 'tableContent' }]
          ]
        }
      },
      { text: 'A-13A Graphix tower, Sec-62, Noida', style: 'footer' }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 14,
        margin: [0, 10, 0, 5],
      },
      invoiceTitle: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      },
      tableContent: {
        fontSize: 12,
        color: 'black'
      },
      totalCell: {
        bold: true,
        fontSize: 12,
        alignment: 'right'
      },
      totalDue: {
        bold: true,
        fontSize: 14,
        alignment: 'right',
        fillColor: '#4caf50',
        color: 'white'
      },
      footer: {
        margin: [0, 50, 0, 0],
        alignment: 'center',
        fontSize: 10,
      },
      regNoLabel: {
        font: 'Roboto',
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 1.5,
      },
      regNoValue: {
        font: 'Roboto',
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 1.5,
      }
    }
  };

  const printer = new PdfPrinter(loadFonts());

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const writeStream = fs.createWriteStream(invoiceFilePath);
  pdfDoc.pipe(writeStream);

  return new Promise((resolve, reject) => {
    pdfDoc.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
};

module.exports = {
  createInvoicePdf,
  loadFonts,
  loadLogo,
};
