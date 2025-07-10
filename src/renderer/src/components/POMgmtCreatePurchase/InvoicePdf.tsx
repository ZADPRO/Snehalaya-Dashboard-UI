import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo/invoice.png';

interface Supplier {
  id: number;
  supplierName: string;
}

// interface Branch {
//   refBranchId: number;
//   refBranchName: string;
//   refBranchCode: string;
// }

interface Product {
  poId: number;
  poName: string;
  poDescription: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  poTotalPrice: string;
}

export const generateInvoice = (
  supplier: Supplier | null,
  // branch: Branch | null,
  products: Product[]
) => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = logo;

  img.onload = () => {
    doc.addImage(img, 'PNG', 12, 5, 50, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SNEHALAYAA SILKS', 14, 40);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SVAP TEXTILES LLP', 14, 45);
    doc.text('No.23, Venkatanarayana Road, T.Nagar,', 14, 50);
    doc.text('Chennai, Tamil Nadu, India - 600017', 14, 55);
    doc.text('GST No: 33AFDFS4445R1ZG', 14, 60);
    doc.text('Supplier Ref: 287', 14, 65);

    // Invoice Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Purchase/PO-${Date.now()}`, 145, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Created On: ${new Date().toLocaleString()}`, 145, 20);
    doc.text('Due On: --', 145, 25);

    // Dispatch From
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Dispatched From:', 14, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('SVAP TEXTILES LLP Warehouse', 14, 80);
    doc.text('Chennai Industrial Estate', 14, 85);
    doc.text('Tamil Nadu, India - 600058', 14, 90);

    // Dispatch To
    doc.setFont('helvetica', 'bold');
    doc.text('Dispatched To:', 135, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('NO:37,1ST FLOOR, RAMNNAPET,', 135, 80);
    doc.text('BANGALORE, Karnataka, India - 560002', 135, 85);
    doc.text('Contact: +91 XXXXXXXX', 135, 90);

    // Supplier Info
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier Detail', 127, 35);
    doc.setFont('helvetica', 'normal');
    doc.text(supplier?.supplierName || 'Not Selected', 130, 40);
    doc.text('Membership Number:', 130, 45);
    doc.text('NO:37,1ST FLOOR, RAMNNAPET,', 130, 50);
    doc.text('BANGALORE, Karnataka, India - 560002', 130, 55);
    doc.text('Tax Number: XX9999999XX', 130, 60);
    doc.text('Mobile: +91 XXXXXXXX', 130, 65);

    // Table columns and data
    const columns = [
      { header: 'SL.NO', dataKey: 'slno' },
      { header: 'Product Description', dataKey: 'description' },
      { header: 'HSN/SAC', dataKey: 'hsn' },
      { header: 'Quantity', dataKey: 'qty' },
      { header: 'Price', dataKey: 'price' },
      { header: 'Disc%', dataKey: 'disc' },
      { header: 'Discount', dataKey: 'discount' },
      { header: 'Total Price', dataKey: 'total' },
    ];

    const data = products.map((p, index) => ({
      slno: index + 1,
      description: `${p.poName} - ${p.poDescription}`,
      hsn: p.poHSN,
      qty: p.poQuantity,
      price: p.poPrice,
      disc: p.poDiscPercent,
      discount: p.poDisc,
      total: p.poTotalPrice,
    }));

    autoTable(doc, {
      startY: 100,
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

    doc.save('invoice.pdf');
  };
};
