import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo/invoice (3).png'; 

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

interface Supplier {
  supplierId: number;
  supplierCompanyName: string;
  supplierCode: string;
  supplierEmail: string;
  supplierContactNumber: string;
  supplierDoorNumber: string;
  supplierStreet: string;
  supplierCity: string;
  supplierState: string;
  supplierCountry: string;
}

interface Branch {
  refBranchId: number;
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
}

interface ProductEntry {
  poId: number;
  poName: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  poTotalPrice: string;
  sku: string;
}

interface InvoiceParams {
  supplier: Supplier;
  branch: Branch;
  productEntries: ProductEntry[];
  creditedDate: string;
  transport: string;
  subTotal: number;
  discountTotal: number;
  tax: number;
  total: number;
  totalPaid: number;
  pendingPayment: number;
}

export const debitInvoice1 = async ({
  supplier,
  productEntries,
  subTotal,
  tax,
  total,
 
}: InvoiceParams) => {
  
  const base64Logo = await getImageBase64(logo);
 const doc = new jsPDF({ compress: true });
  doc.addImage(base64Logo, 'PNG', 12, 5, 50, 35);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SNEHALAYAA SILKS', 14, 40);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SVAP TEXTILES LLP', 14, 45);
  doc.text('No.23, Venkatanarayana Road, T.Nagar,', 14, 50);
  doc.text('Chennai, Tamil Nadu, India - 600017', 14, 55);
  doc.text('GST No: 33AFDFS4445R1ZG', 14, 60);
  doc.text(`Supplier Ref: ${supplier.supplierCode}`, 14, 65);

  doc.setFont('helvetica', 'bold');
  doc.text('Debit Note', 180, 15, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Created On: ${new Date().toLocaleString()}`, 180, 20, { align: 'right' });

  // doc.setFont('helvetica', 'bold');
  // doc.text('Dispatched From:', 14, 75);
  // doc.setFont('helvetica', 'normal');
  // doc.setFontSize(10);
  // // doc.text(supplier.supplierCompanyName, 14, 80);
  // // doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 14, 85);
  // // doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, India`, 14, 90);
  // // doc.text(`Email: ${supplier.supplierEmail}`, 14, 95);
  // // doc.text(`Mobile: ${supplier.supplierContactNumber}`, 14, 100);

  // doc.setFont('helvetica', 'bold');
  // doc.text('Dispatched To:', 135, 75);
  // doc.setFont('helvetica', 'normal');
  //  doc.text(supplier.supplierCompanyName, 135, 80);
  // doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 135, 85);
  // doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, India`, 135, 90);
  // doc.text(`Email: ${supplier.supplierEmail}`, 135, 95);
  // doc.text(`Mobile: ${supplier.supplierContactNumber}`, 135, 100);
  // // doc.text(branch.refBranchName, 135, 80);
  // // doc.text(branch.refLocation, 135, 85);
  // // doc.text(`Email: ${branch.refEmail}`, 135, 90);
  // // doc.text(`Mobile: ${branch.refMobile}`, 135, 95);
  // // doc.text(`Expected Date: ${creditedDate}`, 135, 100);

  // doc.setFont('helvetica', 'bold');
  //   doc.text('Supplier Detail', 127, 35);
  //   doc.setFont('helvetica', 'normal');
  //   if (supplier) {
  //     doc.text(supplier.supplierCompanyName, 130, 40);
  //     doc.text(`Membership Number: ${supplier.supplierCode}`, 130, 45);
  //     doc.text(
  //       `${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`,
  //       130,
  //       50
  //     );
  //     doc.text(
  //       `${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`,
  //       130,
  //       55
  //     );
  //     doc.text(`Email: ${supplier.supplierEmail}`, 130, 60);
  //     doc.text(`Mobile: ${supplier.supplierContactNumber}`, 130, 65);
  //   }
const leftStartX = 14;    
const rightStartX = 135;  
const dispatchedFromY = 75;
const supplierStartY = 35;  
const lineHeight = 5;

// Dispatched From (unchanged)
doc.setFont('helvetica', 'bold');
doc.text('Dispatched From:', leftStartX, dispatchedFromY);
doc.setFont('helvetica', 'normal');
doc.text(supplier.supplierCompanyName, leftStartX, dispatchedFromY + lineHeight);
doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, leftStartX, dispatchedFromY + lineHeight * 2);
doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, India`, leftStartX, dispatchedFromY + lineHeight * 3);
doc.text(`Email: ${supplier.supplierEmail}`, leftStartX, dispatchedFromY + lineHeight * 4);
doc.text(`Mobile: ${supplier.supplierContactNumber}`, leftStartX, dispatchedFromY + lineHeight * 5);

// Supplier Detail (moved upward)
doc.setFont('helvetica', 'bold');
doc.text('Supplier Detail:', rightStartX, supplierStartY);
doc.setFont('helvetica', 'normal');
doc.text(supplier.supplierCompanyName, rightStartX, supplierStartY + lineHeight);
doc.text(`Membership Number: ${supplier.supplierCode}`, rightStartX, supplierStartY + lineHeight * 2);
doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, rightStartX, supplierStartY + lineHeight * 3);
doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`, rightStartX, supplierStartY + lineHeight * 4);
doc.text(`Email: ${supplier.supplierEmail}`, rightStartX, supplierStartY + lineHeight * 5);
doc.text(`Mobile: ${supplier.supplierContactNumber}`, rightStartX, supplierStartY + lineHeight * 6);

// Dispatched To (below Supplier Detail)
const dispatchedToStartY = supplierStartY + lineHeight * 8;
doc.setFont('helvetica', 'bold');
doc.text('Dispatched To:', rightStartX, dispatchedToStartY);
doc.setFont('helvetica', 'normal');
// doc.text(branch.refBranchName, rightStartX, dispatchedToStartY + lineHeight);
// doc.text(branch.refLocation, rightStartX, dispatchedToStartY + lineHeight * 2);
// doc.text(`Email: ${branch.refEmail}`, rightStartX, dispatchedToStartY + lineHeight * 3);
// doc.text(`Mobile: ${branch.refMobile}`, rightStartX, dispatchedToStartY + lineHeight * 4);
// doc.text(`Expected Date: ${creditedDate}`, rightStartX, dispatchedToStartY + lineHeight * 5);
 doc.text(supplier.supplierCompanyName, rightStartX, dispatchedToStartY + lineHeight);
  doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, rightStartX, dispatchedToStartY + lineHeight * 2);
  doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, India`, rightStartX, dispatchedToStartY + lineHeight * 3);
  doc.text(`Email: ${supplier.supplierEmail}`,rightStartX, dispatchedToStartY + lineHeight * 4);
  doc.text(`Mobile: ${supplier.supplierContactNumber}`,rightStartX, dispatchedToStartY + lineHeight * 5);
  const columns = [
    { header: 'S.No', dataKey: 'slno' },
    { header: 'Product', dataKey: 'poName' },
    { header: 'HSN', dataKey: 'poHSN' },
    { header: 'Qty', dataKey: 'poQuantity' },
    { header: 'Price', dataKey: 'poPrice' },
    { header: 'Disc%', dataKey: 'poDiscPercent' },
    { header: 'Discount', dataKey: 'poDisc' },
    { header: 'Amount', dataKey: 'poTotalPrice' },
    { header: 'SKU', dataKey: 'sku' }
  ];

  const data = productEntries.map((entry, i) => ({
    slno: i + 1,
    ...entry
  }));

  autoTable(doc, {
    startY: 110,
    columns,
    body: data,
    styles: { fontSize: 8, textColor: '#000000' },
    headStyles: {
      fillColor: false,
      textColor: '#000000',
      fontStyle: 'bold'
    },
   didDrawPage: (data) => {
  const pageSize = doc.internal.pageSize;
  const pageCount = (doc as any).internal.getNumberOfPages();

  doc.setFontSize(8);
  doc.text(
    `Page ${data.pageNumber} of ${pageCount}`,
    pageSize.width / 2,
    pageSize.height - 10,
    { align: 'center' }
  );
}

  });

const summaryStartY = (doc.lastAutoTable?.finalY ?? 110) + 10;
 const summaryColumns = [
  { header: 'Tax Type', dataKey: 'taxType' },
  { header: 'Taxable Value', dataKey: 'taxableValue' },
  { header: 'Tax Amount', dataKey: 'taxAmount' },
  { header: 'Total', dataKey: 'total' },
];

const summaryData = [
  {
    taxType: 'IGST ',
    taxableValue: subTotal.toFixed(2),
    taxAmount: tax.toFixed(2),
    total: total.toFixed(2),
  },
];

doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.text('Tax Summary', 14, summaryStartY + 1);

autoTable(doc, {
  startY: summaryStartY + 3,
  columns: summaryColumns,
  body: summaryData,
  styles: { fontSize: 8 },
  headStyles: {
    fillColor: false,
    textColor: [0, 0, 0],
   
  },
  columnStyles: {
    taxType: { halign: 'left' },
    taxableValue: { halign: 'left' },
    taxAmount: { halign: 'left' },
    total: { halign: 'left' },
  },
  tableWidth: 'auto',
});

return doc;
};

const getImageBase64 = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = reject;
  });
