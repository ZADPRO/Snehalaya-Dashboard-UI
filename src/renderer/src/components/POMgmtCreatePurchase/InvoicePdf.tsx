// src/utils/invoice.tsx

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

interface ProductData {
  refPName?: string;
  refPSKU?: string;
  refPBrand?: string;
  refPStatus?: boolean;
  refPPrice?: number;
  refPMRP?: number;
  createdBy?: string;
  createdAt?: string;
}

export const generateInvoicePDF = async (product: ProductData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const {  height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 40;

  // Logo
  const logoUrl = '/logo.png';
  try {
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.15);
    page.drawImage(logoImage, {
      x: 50,
      y: y - logoDims.height,
      width: logoDims.width,
      height: logoDims.height,
    });
    y -= logoDims.height + 20;
  } catch (err) {
    console.warn('Logo not found or failed to load:', err);
  }

  // Company address and contact
  const companyLines = [
    'SNEHALAYA SILKS',
    'SVAP TEXTILES LLP',
    'No.23, Venkatanarayana Road, T.Nagar, Chennai, India, Tamil Nadu, 600017',
    'GST No: 33AAFDS5445R1ZG',
    'Dispatched From:',
    'NO:37, 1ST FLOOR, RAMNNAPET, JM ROAD, BANGALORE, Karnataka, 560002',
    'Phone: +91 8088362436',
  ];

  for (const line of companyLines) {
    page.drawText(line, {
      x: 50,
      y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  }

  y -= 10;

  // Invoice Title
  page.drawText('Purchase Invoice', {
    x: 200,
    y,
    size: 18,
    font,
    color: rgb(0.2, 0.2, 0.8),
  });

  y -= 40;

  // Product metadata
  const tableData: [string, string | number | boolean | undefined][] = [
    ['Product Name', product.refPName],
    ['SKU', product.refPSKU],
    ['Brand', product.refPBrand],
    ['Price', product.refPPrice],
    ['MRP', product.refPMRP],
    ['Created By', product.createdBy],
    ['Created At', product.createdAt],
  ];

  for (const [label, value] of tableData) {
    page.drawText(`${label}:`, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`${value || '-'}`, {
      x: 200,
      y,
      size: 12,
      font,
    });
    y -= 20;
  }

  y -= 10;

  // Item list from invoice image
  const items = [
    { sl: 1, desc: 'FANCY D SAREES 27014', sku: 'SS072039', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 2, desc: 'FANCY D SAREES 27014', sku: 'SS072040', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 3, desc: 'FANCY D SAREES 27014', sku: 'SS072041', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 4, desc: 'FANCY D SAREES 27014', sku: 'SS072042', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 5, desc: 'FANCY D SAREES 27014', sku: 'SS072043', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 6, desc: 'FANCY D SAREES 27014', sku: 'SS072044', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 7, desc: 'FANCY D SAREES 2957', sku: 'SS072049', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 8, desc: 'FANCY D SAREES 2957', sku: 'SS072050', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 9, desc: 'FANCY D SAREES 2957', sku: 'SS072051', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 10, desc: 'FANCY D SAREES 2957', sku: 'SS072052', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 11, desc: 'FANCY D SAREES 2957', sku: 'SS072053', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 12, desc: 'FANCY D SAREES 2957', sku: 'SS072054', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 13, desc: 'FANCY D SAREES 2957', sku: 'SS072055', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 14, desc: 'FANCY D SAREES 22129', sku: 'SS072063', hsn: '54078112', qty: 1, price: 775, total: 775 },
    { sl: 15, desc: 'FANCY D SAREES 22129', sku: 'SS072064', hsn: '54078112', qty: 1, price: 775, total: 775 },
  ];

  // Table header
  page.drawText('SL', { x: 50, y, size: 10, font });
  page.drawText('Description', { x: 80, y, size: 10, font });
  page.drawText('SKU', { x: 250, y, size: 10, font });
  page.drawText('HSN', { x: 320, y, size: 10, font });
  page.drawText('Qty', { x: 370, y, size: 10, font });
  page.drawText('Price', { x: 400, y, size: 10, font });
  page.drawText('Total', { x: 460, y, size: 10, font });

  y -= 15;

  // Draw items
  for (const item of items) {
    if (y < 50) break; // Avoid overflow
    page.drawText(`${item.sl}`, { x: 50, y, size: 10, font });
    page.drawText(item.desc, { x: 80, y, size: 10, font });
    page.drawText(item.sku, { x: 250, y, size: 10, font });
    page.drawText(item.hsn, { x: 320, y, size: 10, font });
    page.drawText(`${item.qty}`, { x: 370, y, size: 10, font });
    page.drawText(`₹ ${item.price}`, { x: 400, y, size: 10, font });
    page.drawText(`₹ ${item.total}`, { x: 460, y, size: 10, font });
    y -= 15;
  }

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'purchase-invoice.pdf');
};
