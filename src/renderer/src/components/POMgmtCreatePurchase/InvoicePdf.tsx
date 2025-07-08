import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import logo from '../../assets/logo/icon.png' 
interface ProductRow {
  slNo: number;
  description: string;
  sku: string;
  hsn: string;
  qty: number;
  price: number;
  total: number;
}

export const generateInvoicePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); 
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

const logoX = 30;
const logoY = y - 100;
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

const logoOriginalWidth = logoImage.width;
const logoOriginalHeight = logoImage.height;

const widthScale = maxLogoWidth / logoOriginalWidth;
const heightScale = maxLogoHeight / logoOriginalHeight;
const scale = Math.min(widthScale, heightScale); 

const logoDrawWidth = logoOriginalWidth * scale;
const logoDrawHeight = logoOriginalHeight * scale;

const logoDrawX = logoX + (bgWidth - logoDrawWidth) / 2;
const logoDrawY = logoY + (bgHeight - logoDrawHeight) / 2;


page.drawImage(logoImage, {
  x: logoX + 10, 
  y: logoY + 10,
  width: logoDrawX,
  height:logoDrawY ,
});


  
  y = logoY - 20;
  drawText('SNEHALAYA SILKS', 30, y, 14, fontBold);
  y -= 15;
  drawText('SVAP TEXTILES LLP', 30, y);
  y -= 15;
  drawText('No.23, Venkatanarayana Road,', 30, y);
y -= 13;
drawText('T.Nagar, Chennai, India,', 30, y);
y -= 13;
drawText('Tamil Nadu, 600017', 30, y);
y -= 13;

  y -= 13;
  drawText('GST No: 33AAFDS5445R1ZG', 30, y);

  drawText('Purchase/POINVC-259-2526-WH', 350, 800, 12, fontBold, rgb(0.2, 0.2, 0.6));
  drawText('Created On: 31 May 2025 05:48:26 PM', 350, 785);
  drawText('Due On: 15 Jul 2025', 350, 770);

  y -= 15;
  drawText('Supplier Detail:', 350, y, 10, fontBold);
  y -= 12;
  drawText('SABOO SEIDE', 350, y);
  y -= 12;
  drawText('NO.37, 1ST FLOOR, RAMNNAPET, BANGALORE', 350, y);
  y -= 12;
  drawText('Tax Number: 29AADFS0737J1ZU', 350, y);
  y -= 12;
  drawText('Mobile: +91 8088362436', 350, y);

 
  y -= 30;
  const startY = y;
  const colWidths = [30, 120, 80, 60, 50, 50, 50, 60];
  const headers = ['SL.NO', 'Product Description', 'SKU', 'HSN/SAC', 'Qty', 'Price', 'Disc%', 'Total'];
  let x = 30;

  headers.forEach((header, i) => {
    drawText(header, x, y, 9, fontBold);
    x += colWidths[i];
  });

  
  const rows: ProductRow[] = Array.from({ length: 15 }, (_, i) => ({
    slNo: i + 1,
    description: i < 7 ? 'FANCY D SAREES 27014' : i < 13 ? 'FANCY D SAREES 2957' : 'FANCY D SAREES 22129',
    sku: `SS0720${39 + i}`,
    hsn: '54078112',
    qty: 1,
    price: 775,
    total: 775
  }));

  y -= 20;

  rows.forEach((row) => {
    x = 30;
  const values = [
  row.slNo.toString(),
  row.description,
  row.sku,
  row.hsn,
  row.qty.toString(),
  `Rs. ${row.price.toFixed(2)}`,
  '0%',
  `Rs. ${row.total.toFixed(2)}`
];


    values.forEach((val, i) => {
      drawText(val, x, y, 9);
      x += colWidths[i];
    });

    y -= 18;
  });

  drawText('Page: 1/1', 500, 20, 9, fontBold);

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'static-invoice.pdf');
};
