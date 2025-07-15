import { jsPDF } from 'jspdf'; 
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
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      try {
        
        doc.addImage(img, 'PNG', 12, 5, 50, 35, '', 'FAST'); // Using lower quality for smaller size

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

        // Invoice Info
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Purchase/PO-${Date.now()}`, 145, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Created On: ${new Date().toLocaleString()}`, 145, 20);
        doc.text('Due On: --', 145, 25);

        // Dispatched From
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

        // Dispatched To
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

        // Table columns and data
        const columns = [
          { header: 'SL.NO', dataKey: 'slno' },
          { header: 'Product', dataKey: 'product' },
          { header: 'Description', dataKey: 'description' },
          { header: 'SKU', dataKey: 'sku' },
          { header: 'HSN/SAC', dataKey: 'hsn' },
          { header: 'Quantity', dataKey: 'qty' },
          { header: 'Price', dataKey: 'price' },
          // { header: 'Disc%', dataKey: 'disc' },
          { header: 'Discount', dataKey: 'discount' },
          { header: 'Total Price', dataKey: 'total' },
        ];

        const data = products.map((p, index) => ({
          slno: index + 1,
          product: p.poName,
          sku: p.posku,
          hsn: p.poHSN,
          qty: p.poQuantity.toString(),
          price: parseFloat(p.poPrice.toString()).toFixed(2),
          // disc: parseFloat(p.poDiscPercent.toString()).toFixed(2),
          discount: parseFloat(p.poDisc.toString()).toFixed(2),
          total: parseFloat(p.poTotalPrice.toString()).toFixed(2),
        }));

        autoTable(doc, {
          startY: 110,
          columns,
          body: data,
          styles: { fontSize: 6, textColor: '#000000' }, 
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

        // Generate the PDF and prepare for printing
        const pdfUrl = doc.output('bloburl');
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        }

        // Save the PDF as well
        doc.save('invoice.pdf');

        // Resolve the Promise after all actions
        resolve();
      } catch (error) {
        reject(error); // Reject in case of an error
      }
    };

    img.onerror = () => reject(new Error('Image failed to load')); // Handle image load error
  });
};
