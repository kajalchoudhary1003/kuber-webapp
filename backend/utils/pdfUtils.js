const path = require('path');
const fs = require('fs');
const PdfPrinter = require('pdfmake');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const loadFonts = () => ({
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
});

const loadLogo = () => {
  try {
    const logoPath = path.join(__dirname, './logo/CVT_logo.png');
    if (fs.existsSync(logoPath)) {
      return fs.readFileSync(logoPath, 'base64');
    }
    console.warn('Logo file not found, using empty logo');
    return '';
  } catch (error) {
    console.warn('Error loading logo:', error.message);
    return '';
  }
};

const createInvoicePdf = async (invoiceData, employeeDetails, invoiceFilePath) => {
  const { clientId, year, month, totalAmount, logoBase64, clientName, clientAddress, bankDetails, currencyCode } = invoiceData;

  if (!clientName) {
    console.warn(`clientName is missing or empty for clientId=${clientId}, using fallback 'Unknown Client'`);
  }

  // Calculate dates
  const invoiceDate = new Date();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
  const monthName = monthNames[month - 1];
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const invoicePeriod = `${month}/1/${year} to ${month}/${lastDayOfMonth}/${year}`;

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 80, 40, 60],
    header: [
      {
        image: logoBase64 ? `data:image/png;base64,${logoBase64}` : undefined,
        width: 150,
        height: 40,
        alignment: 'left',
        margin: [40, 20, 0, 0],
      },
      {
        text: 'Reg. No: REG1234567890CVT',
        alignment: 'right',
        margin: [0, 30, 40, 0],
        style: 'regNo',
      },
    ],
    content: [
      { text: 'INVOICE', style: 'invoiceTitle' },
      { text: `Project: ${clientName || 'Unknown Client'}`, style: 'subheader' },
      { text: `Invoice number: CVT${year}${month}_${clientId}`, style: 'subheader' },
      { text: `Invoice Date: ${invoiceDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}`, style: 'subheader' },
      { text: `Payment Due Date: ${dueDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}`, style: 'subheader' },
      { text: `Invoiced to: ${clientName || 'Unknown Client'}`, style: 'subheader' },
      { text: clientAddress || 'N/A', style: 'subheader' },
      { text: `Invoice Period: ${invoicePeriod}`, style: 'subheader' },
      {
        style: 'table',
        table: {
          widths: ['*', 100],
          headerRows: 1,
          body: [
            [
              { text: 'Services', style: 'tableHeader' },
              { text: `Cost (${currencyCode})`, style: 'tableHeader', alignment: 'right' },
            ],
            ...employeeDetails.map(detail => [
              { text: detail.name, style: 'tableContent' },
              { text: detail.amount, style: 'tableContent', alignment: 'right' },
            ]),
            [
              { text: 'Last Month Balance', style: 'tableContent' },
              { text: '200', style: 'tableContent', alignment: 'right' },
            ],
            [
              { text: 'Total', style: 'totalCell' },
              { text: totalAmount.toFixed(2), style: 'totalCell', alignment: 'right' },
            ],
            [
              { text: `Total Due ${currencyCode}`, style: 'totalDue' },
              { text: `${currencyCode} ${totalAmount.toFixed(2)}`, style: 'totalDue', alignment: 'right' },
            ],
          ],
        },
      },
      {
        style: 'table',
        margin: [0, 20, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [{ text: 'Payment details', style: 'tableHeader' }],
            [{ text: `Payee name: ${bankDetails.payeeName}`, style: 'tableContent' }],
            [{ text: `Bank: ${bankDetails.bankName}`, style: 'tableContent' }],
            [{ text: `Account No: ${bankDetails.accountNo}`, style: 'tableContent' }],
            [{ text: `Swift code: ${bankDetails.swiftCode}`, style: 'tableContent' }],
            [{ text: `IFSC code: ${bankDetails.ifscCode}`, style: 'tableContent' }],
          ],
        },
      },
    ],
    footer: {
      text: 'A-13A Graphix Tower, Sec-62, Noida',
      alignment: 'center',
      style: 'footer',
      margin: [0, 20, 0, 0],
    },
    styles: {
      invoiceTitle: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 20, 0, 20],
      },
      subheader: {
        fontSize: 12,
        margin: [0, 4, 0, 4],
      },
      table: {
        margin: [0, 20, 0, 20],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
        fillColor: '#f5f5f5',
        margin: [0, 4, 0, 4],
      },
      tableContent: {
        fontSize: 11,
        margin: [0, 4, 0, 4],
      },
      totalCell: {
        bold: true,
        fontSize: 12,
        margin: [0, 4, 0, 4],
      },
      totalDue: {
        bold: true,
        fontSize: 14,
        fillColor: '#e0f7fa',
        color: '#006064',
        margin: [0, 4, 0, 4],
      },
      regNo: {
        fontSize: 10,
        color: '#555',
      },
      footer: {
        fontSize: 10,
        color: '#555',
      },
    },
    defaultStyle: {
      font: 'Helvetica',
      fontSize: 11,
      lineHeight: 1.2,
    },
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