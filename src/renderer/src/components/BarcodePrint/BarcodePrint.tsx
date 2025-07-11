
// import React, { useRef, useEffect } from 'react';
// import Barcode from 'react-barcode';
// import html2pdf from 'html2pdf.js';
// import parentBarcode from './parentBarcode';

// interface Product {
//   productName: string;
//   sku: string;
//   price: number;
// }

// interface Props {
//   products: Product[];
//   onClose: () => void;
// }

// const BarcodePrint: React.FC = () => {

//   const printRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (printRef.current) {
//       html2pdf().from(printRef.current).save('barcodes.pdf');
//     }

//     setTimeout(() => 2000);
//   }, []);

//   return (
//     <div style={{ display: 'none' }}>
//       <div ref={printRef}>
//         {products.map((p, i) => (
//           <div key={i} style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc' }}>
//             <p><strong>Product:</strong> {p.productName}</p>
//             <p><strong>SKU:</strong> {p.sku}</p>
//             <p><strong>Price:</strong> ₹{p.price.toFixed(2)}</p>
//             <Barcode value={`${p.productName}-${p.sku}`} height={60} width={2} displayValue />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BarcodePrint;
