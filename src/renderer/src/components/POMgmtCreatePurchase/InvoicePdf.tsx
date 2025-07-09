import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import logo from '../../assets/logo/icon.png';

interface ProductRow {
  slNo: number;
  product:string;
  description: string;
  sku: string;
  hsn: string;
  qty: number;
  price: number;
  total: number;
}

export const generateInvoicePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 10,
    fontType = font,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, { x, y, size, font: fontType, color });
  };

  // =====================
  // LOGO + BACKGROUND
  // =====================
  const logoX = 30;
  const logoY = y - 60;
  const bgWidth = 140;
  const bgHeight = 70;

  page.drawRectangle({
    x: logoX,
    y: logoY,
    width: bgWidth,
    height: bgHeight,
    color: rgb(0.5, 0, 0.5),
  });

  const logoBytes = await fetch(logo).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const padding = 10;
  const maxLogoWidth = bgWidth - 2 * padding;
  const maxLogoHeight = bgHeight - 2 * padding;

  const widthScale = maxLogoWidth / logoImage.width;
  const heightScale = maxLogoHeight / logoImage.height;
  const scale = Math.min(widthScale, heightScale);

  const logoDrawWidth = logoImage.width * scale;
  const logoDrawHeight = logoImage.height * scale;

  const logoDrawX = logoX + (bgWidth - logoDrawWidth) / 2;
  const logoDrawY = logoY + (bgHeight - logoDrawHeight) / 2;

  page.drawImage(logoImage, {
    x: logoDrawX,
    y: logoDrawY,
    width: logoDrawWidth,
    height: logoDrawHeight,
  });

  // =====================
  // COMPANY DETAILS (LEFT)
  // =====================
  y = logoY - 15;
  drawText('SNEHALAYA SILKS', 30, y, 14, fontBold);
  y -= 15;
  drawText('SVAP TEXTILES LLP', 30, y);
  y -= 13;
  drawText('No.23, Venkatanarayana Road,', 30, y);
  y -= 13;
  drawText('T.Nagar, Chennai, India,', 30, y);
  y -= 13;
  drawText('Tamil Nadu, 600017', 30, y);
  y -= 13;
  drawText('GST No: 33AAFDS5445R1ZG', 30, y);

  // =====================
  // RIGHT SIDE: PURCHASE + SUPPLIER
  // =====================
  let yRight = 800;
  drawText('Purchase/POINVC-259-2526-WH', 350, yRight, 12, fontBold, rgb(0.2, 0.2, 0.6));
  yRight -= 13;
  drawText('Created On: 31 May 2025 05:48:26 PM', 350, yRight);
  yRight -= 13;
  drawText('Due On: 15 Jul 2025', 350, yRight);

  yRight -= 28;
  drawText('Supplier Detail:', 350, yRight, 10, fontBold);
  yRight -= 13;
  drawText('SABOO SEIDE', 350, yRight);
  yRight -= 13;
  drawText('NO.37, 1ST FLOOR, RAMNNAPET, BANGALORE', 350, yRight);
  yRight -= 13;
  drawText('Tax Number: 29AADFS0737J1ZU', 350, yRight);
  yRight -= 13;
  drawText('Mobile: +91 8088362436', 350, yRight);

  // =====================
  // PRODUCT TABLE HEADER
  // =====================
  y = Math.min(y, yRight) - 25;
  const colWidths = [30, 70,90, 80, 60, 50, 50, 50, 60];
  const headers = ['SL.NO', 'Product', 'Description', 'SKU', 'HSN/SAC', 'Qty', 'Price', 'Disc%', 'Total'];
  let x = 30;

  headers.forEach((header, i) => {
    drawText(header, x, y, 9, fontBold);
    x += colWidths[i];
  });

  // =====================
  // PRODUCT ROWS
  // =====================
  const rows: ProductRow[] = Array.from({ length: 15 }, (_, i) => ({
    slNo: i + 1,
    product:'Saree',
    description: i < 7 ? 'FANCY D SAREES 27014' : i < 13 ? 'FANCY D SAREES 2957' : 'FANCY D SAREES 22129',
    sku: `SS0720${39 + i}`,
    hsn: '54078112',
    qty: 1,
    price: 775,
    total: 775,
  }));

  y -= 20;

  const cellPadding = 4;

rows.forEach((row) => {
  x = 30;
  const values = [
    row.slNo.toString(),
    'Saree',
    row.description,
    row.sku,
    row.hsn,
    row.qty.toString(),
    `Rs. ${row.price.toFixed(2)}`,
    '0%',
    `Rs. ${row.total.toFixed(2)}`,
  ];

  values.forEach((val, i) => {
    drawText(val, x + cellPadding, y, 7);
    x += colWidths[i];
  });

  y -= 20; // More row spacing
});


  // =====================
  // PAGE NUMBER
  // =====================
  drawText('Page: 1/1', 500, 20, 9, fontBold);

  // =====================
  // SAVE PDF
  // =====================
  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'static-invoice.pdf');
};
