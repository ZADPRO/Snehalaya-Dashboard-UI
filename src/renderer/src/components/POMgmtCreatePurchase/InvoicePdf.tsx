import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo/invoice.png'; // Adjust path as needed

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

interface Product {
  poId: number;
  poName: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  posku: string;
  poTotalPrice: string;
}

// Convert image to base64
const toBase64 = (url: string): Promise<string> => {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
};

export const generateInvoice = async (
  supplier: Supplier | null,
  branch: Branch | null,
  products: Product[],
  creditedDate: Date | null
): Promise<jsPDF> => {
  const doc = new jsPDF();
  const base64Logo = await toBase64(logo); // ✅ Wait for logo

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const dueDate = creditedDate ? formatDate(creditedDate) : '--';

  // Header
  doc.addImage(base64Logo, 'PNG', 12, 5, 50, 35);
  doc.setFontSize(12).setFont('helvetica', 'bold').text('SNEHALAYAA SILKS', 14, 40);
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text('SVAP TEXTILES LLP', 14, 45);
  doc.text('No.23, Venkatanarayana Road, T.Nagar,', 14, 50);
  doc.text('Chennai, Tamil Nadu, India - 600017', 14, 55);
  doc.text('GST No: 33AFDFS4445R1ZG', 14, 60);
  doc.text(`Supplier Ref: ${supplier?.supplierCode || 'N/A'}`, 14, 65);

  doc.setFontSize(11).setFont('helvetica', 'bold');
  doc.text(`Purchase/PO-${Date.now()}`, 145, 15);
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(`Created On: ${new Date().toLocaleString()}`, 145, 20);
  doc.text(`Due On: ${dueDate}`, 145, 25);

  // Dispatched From
  doc.setFontSize(11).setFont('helvetica', 'bold').text('Dispatched From:', 14, 75);
  doc.setFontSize(10).setFont('helvetica', 'normal');
  if (supplier) {
    doc.text(supplier.supplierCompanyName, 14, 80);
    doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 14, 85);
    doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`, 14, 90);
    doc.text(`Email: ${supplier.supplierEmail}`, 14, 95);
    doc.text(`Mobile: ${supplier.supplierContactNumber}`, 14, 100);
  }

  // Supplier Detail & Dispatched To
  const rightStartX = 135;
  const lineHeight = 5;
  const supplierStartY = 35;

  doc.setFont('helvetica', 'bold').text('Supplier Detail:', rightStartX, supplierStartY);
  doc.setFont('helvetica', 'normal');
  if (supplier) {
    doc.text(supplier.supplierCompanyName, rightStartX, supplierStartY + lineHeight);
    doc.text(`Membership Number: ${supplier.supplierCode}`, rightStartX, supplierStartY + lineHeight * 2);
    doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, rightStartX, supplierStartY + lineHeight * 3);
    doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`, rightStartX, supplierStartY + lineHeight * 4);
    doc.text(`Email: ${supplier.supplierEmail}`, rightStartX, supplierStartY + lineHeight * 5);
    doc.text(`Mobile: ${supplier.supplierContactNumber}`, rightStartX, supplierStartY + lineHeight * 6);
  }

  const dispatchedToStartY = supplierStartY + lineHeight * 8;
  doc.setFont('helvetica', 'bold').text('Dispatched To:', rightStartX, dispatchedToStartY);
  doc.setFont('helvetica', 'normal').setFontSize(10);
  if (branch) {
    doc.text(branch.refBranchName, rightStartX, dispatchedToStartY + lineHeight);
    doc.text(branch.refLocation, rightStartX, dispatchedToStartY + lineHeight * 2);
    doc.text(`Email: ${branch.refEmail}`, rightStartX, dispatchedToStartY + lineHeight * 3);
    doc.text(`Mobile: ${branch.refMobile}`, rightStartX, dispatchedToStartY + lineHeight * 4);
  }

  // Product Table
  const columns = [
    { header: 'SL.NO', dataKey: 'slno' },
    { header: 'Product', dataKey: 'product' },
    { header: 'SKU', dataKey: 'sku' },
    { header: 'HSN/SAC', dataKey: 'hsn' },
    { header: 'Quantity', dataKey: 'qty' },
    { header: 'Price', dataKey: 'price' },
    { header: 'Disc%', dataKey: 'disc' },
    { header: 'Discount', dataKey: 'discount' },
    { header: 'Total Price', dataKey: 'total' },
  ];

  const data = products.map((p, index) => ({
    slno: index + 1,
    product: p.poName,
    sku: p.posku,
    hsn: p.poHSN,
    qty: p.poQuantity,
    price: parseFloat(p.poPrice).toFixed(2),
    disc: parseFloat(p.poDiscPercent).toFixed(2),
    discount: parseFloat(p.poDisc).toFixed(2),
    total: parseFloat(p.poTotalPrice).toFixed(2),
  }));

  autoTable(doc, {
    startY: 110,
    columns,
    body: data,
    styles: { fontSize: 8, textColor: '#000000' },
    headStyles: {
      fontStyle: 'bold',
      fillColor: false,
      textColor: '#000000',
    },
    didDrawPage: () => {
      const pageCount = doc.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height || pageSize.getHeight();
      doc.setFontSize(9);
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${pageCount}`, pageSize.width - 40, pageHeight - 10);
    },
  });

  return doc;
};
