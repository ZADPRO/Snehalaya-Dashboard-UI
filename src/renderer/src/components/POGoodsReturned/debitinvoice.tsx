import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo/invoice.png';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: any;
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

export const debitInvoice1 = async ({
  supplier,
  branch,
  productEntries,
  creditedDate,
  transport,
  subTotal,
  discountTotal,
  tax,
  total,
  totalPaid,
  pendingPayment
}: InvoiceParams) => {
  const doc = new jsPDF();
  const base64Logo = await getImageBase64(logo);

  // Header
  doc.addImage(base64Logo, 'PNG', 12, 5, 80, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Debit Note', 185, 15, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SNEHALAYAA SILKS', 14, 50);
  doc.text('SVAP TEXTILES LLP', 14, 55);
  doc.text('No.23, Venkatanarayana Road, T.Nagar,', 14, 60);
  doc.text('Chennai, Tamil Nadu, India - 600017', 14, 65);
  doc.text('GST No: 33AFDFS4445R1ZG', 14, 70);
  doc.text('Supplier Ref: 287', 14, 75);
  doc.text(`Created On: ${new Date().toLocaleString()}`, 190, 20, { align: 'right' });

  // Supplier Details
  doc.setFont('helvetica', 'bold');
  doc.text('Supplier Detail', 130, 35);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(supplier.supplierCompanyName, 130, 40);
  doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 130, 45);
  doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`, 130, 50);
  doc.text(`Email: ${supplier.supplierEmail}`, 130, 55);
  doc.text(`Mobile: ${supplier.supplierContactNumber}`, 130, 60);
  doc.text(`Supplier Code: ${supplier.supplierCode}`, 130, 65);

  // Dispatch Info
  doc.setFont('helvetica', 'bold');
  doc.text('Dispatched From:', 14, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(supplier.supplierCompanyName, 15, 90);
  doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 15, 95);
  doc.text(`${supplier.supplierCity}, ${supplier.supplierState} - India`, 14, 100);

  doc.setFont('helvetica', 'bold');
  doc.text('Dispatched To:', 135, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(branch.refBranchName, 135, 80);
  doc.text(branch.refLocation, 135, 85);
  doc.text(`Email: ${branch.refEmail}`, 135, 90);
  doc.text(`Mobile: ${branch.refMobile}`, 135, 95);
  doc.text(`Expected Date: ${creditedDate}`, 135, 100);

  // Product Table
  const columns = [
    { header: 'S.No', dataKey: 'slno' },
    { header: 'Description', dataKey: 'poName' },
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
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
  });

  // Summary Table (instead of separate tax summary)
  let currentY = doc.lastAutoTable?.finalY ?? 130;
  const summaryRows = [
    ['Sub Total', `₹${subTotal.toFixed(2)}`],
    ['Discount', `₹${discountTotal.toFixed(2)}`],
    ['Tax (5%)', `₹${tax.toFixed(2)}`],
    ['Total', `₹${total.toFixed(2)}`],
    ['Total Paid', `₹${totalPaid.toFixed(2)}`],
    ['Pending Payment', `₹${pendingPayment.toFixed(2)}`]
  ];

  // autoTable(doc, {
  //   startY: currentY + 10,
  //   head: [['Summary', 'Amount']],
  //   body: summaryRows,
  //   styles: { fontSize: 10 },
  //   headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
  //   bodyStyles: { fontStyle: 'normal', halign: 'right' },
  //   columnStyles: {
  //     0: { halign: 'left' },
  //     1: { halign: 'right' }
  //   },
  //   theme: 'grid'
  // });
autoTable(doc, {
  startY: currentY + 10,
  head: [['Summary', 'Amount']],
  body: summaryRows,
  theme: 'grid',
  styles: {
    font: 'helvetica',
    fontSize: 10
  },
  headStyles: {
    fillColor: [230, 230, 230],
    textColor: [0, 0, 0],
    fontStyle: 'bold',
    halign: 'center'
  },
  bodyStyles: {
    textColor: [0, 0, 0],
    fontStyle: 'normal'
  },
  columnStyles: {
    0: { fontStyle: 'bold', halign: 'left' }, 
    1: { fontStyle: 'normal', halign: 'right' } 
  }
});

  // Page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }

  doc.save(`debit-note-${Date.now()}.pdf`);
};
