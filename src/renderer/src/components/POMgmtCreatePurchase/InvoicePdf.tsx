import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo/invoice.png';

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
  // poDescription: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  posku: string;
  poTotalPrice: string;
}

export const generateInvoice = (
  supplier: Supplier | null,
  branch: Branch | null,
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
    doc.text(`Supplier Ref: ${supplier?.supplierCode || 'N/A'}`, 14, 65);

    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Purchase/PO-${Date.now()}`, 145, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Created On: ${new Date().toLocaleString()}`, 145, 20);
    doc.text('Due On: --', 145, 25);

   
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Dispatched From:', 14, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (supplier) {
      doc.text(supplier.supplierCompanyName, 14, 80);
      doc.text(
        `${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`,
        14,
        85
      );
      doc.text(
        `${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`,
        14,
        90
      );
      doc.text(`Email: ${supplier.supplierEmail}`, 14, 95);
      doc.text(`Mobile: ${supplier.supplierContactNumber}`, 14, 100);
    }

   
    doc.setFont('helvetica', 'bold');
    doc.text('Dispatched To:', 135, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (branch) {
      doc.text(branch.refBranchName, 135, 80);
      doc.text(branch.refLocation, 135, 85);
      doc.text(`Email: ${branch.refEmail}`, 135, 90);
      doc.text(`Mobile: ${branch.refMobile}`, 135, 95);
    }

  
    doc.setFont('helvetica', 'bold');
    doc.text('Supplier Detail', 127, 35);
    doc.setFont('helvetica', 'normal');
    if (supplier) {
      doc.text(supplier.supplierCompanyName, 130, 40);
      doc.text(`Membership Number: ${supplier.supplierCode}`, 130, 45);
      doc.text(
        `${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`,
        130,
        50
      );
      doc.text(
        `${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`,
        130,
        55
      );
      doc.text(`Email: ${supplier.supplierEmail}`, 130, 60);
      doc.text(`Mobile: ${supplier.supplierContactNumber}`, 130, 65);
    }

    // Table columns and data
    const columns = [
      { header: 'SL.NO', dataKey: 'slno' },
      { header: 'Product', dataKey: 'product' },
      // { header: 'Description', dataKey: 'description' },
      { header: 'SKU', dataKey: 'sku' }, // SKU Column
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
      // description: `${p.poDescription}`,
      sku: p.posku, 
      hsn: p.poHSN,
      qty: p.poQuantity.toString(), 
  price: parseFloat(p.poPrice.toString()).toFixed(2), 
  disc: parseFloat(p.poDiscPercent.toString()).toFixed(2),  
  discount: parseFloat(p.poDisc.toString()).toFixed(2),  
  total: parseFloat(p.poTotalPrice.toString()).toFixed(2), 
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
        doc.text(
          `Page ${doc.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageSize.width - 40,
          pageHeight - 10
        );
      },
    });

    doc.save('invoice.pdf');
  };
};
