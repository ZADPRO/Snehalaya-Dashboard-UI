// import React, { useEffect, useRef, useState } from 'react';
// import { Dropdown } from 'primereact/dropdown';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';
// import axios from 'axios';
// import { generateInvoice } from '../../components/POMgmtCreatePurchase/InvoicePdf'; // <-- Adjust path if needed

// interface Branch {
//   refBranchId: number;
//   refBranchName: string;
//   refBranchCode: string;
// }

// interface Supplier {
//   id: number;
//   supplierName: string;
// }

// interface Product {
//   poId: number;
//   poName: string;
//   poDescription: string;
//   poHSN: string;
//   poQuantity: string;
//   poPrice: string;
//   poDiscPercent: string;
//   poDisc: string;
//   poTotalPrice: string;
// }

// const AddNewPurchase: React.FC = () => {
//   const toast = useRef<Toast>(null);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
//   const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const dispatchedFrom = `SVAP TEXTILES LLP
//                           No.23, Venkatanarayana Road,
//                           T.Nagar, Chennai, India,
//                           Tamil Nadu, 600017`;

//   useEffect(() => {
//     fetchBranches();
//     fetchSuppliers();
//     fetchProducts();
//   }, []);


//   const fetchBranches = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
//         headers: { Authorization: sessionStorage.getItem('token') },
//       });
//       if (res.data?.status) setBranches(res.data.data);
//     } catch (err) {
//       console.error('Error fetching branches:', err);
//     }
//   };


//   const fetchSuppliers = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/suppliers/read`, {
//         headers: {
//           Authorization: sessionStorage.getItem('token') || '',
//         },
//       });
//       if (response.data?.status) {
//         setSuppliers(response.data.data);
//       }
//     } catch {
//       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch suppliers' });
//     }
//   };

//   //  const fetchProducts = async () => {
//   //   try {
//   //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/suppliers/read`, {
//   //       headers: {
//   //         Authorization: sessionStorage.getItem('token') || '',
//   //       },
//   //     });
//   //     if (response.data?.status) {
//   //       setSuppliers(response.data.data);
//   //     }
//   //   } catch {
//   //     toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch suppliers' });
//   //   }
//   // };

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products/read`, {
//         headers: {
//           Authorization: sessionStorage.getItem('token') || '',
//         },
//       });
//       if (response.data?.status) {
//         setProducts(response.data.data);
//       }
//     } catch {
//       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch products' });

//     }
//   }

//   const handleDownloadPDF = () => {
//     if (!selectedSupplier || !selectedBranch || products.length === 0) {
//       toast.current?.show({ severity: 'warn', summary: 'Missing Info', detail: 'Please select branch, supplier, and products.' });
//       return;
//     }

//     const productsOne: Product[] = Array.from({ length: 140 }, (_, i) => {
//       const quantity = Math.floor(Math.random() * 10 + 1);
//       const price = Math.floor(Math.random() * 500 + 100);
//       const discPercent = Math.floor(Math.random() * 30);
//       const discount = (price * discPercent) / 100;
//       const totalPrice = (price - discount) * quantity;

//       return {
//         poId: i + 1,
//         poName: `Product ${i + 1}`,
//         poDescription: `Description for Product ${i + 1}`,
//         poHSN: `${Math.floor(Math.random() * 9000) + 1000}`,
//         poQuantity: quantity.toString(),
//         poPrice: price.toFixed(2),
//         poDiscPercent: discPercent.toFixed(2),
//         poDisc: discount.toFixed(2),
//         poTotalPrice: totalPrice.toFixed(2),
//       };
//     });

//     console.log(products);


//     generateInvoice(selectedSupplier, selectedBranch, productsOne);
//   };



//   return (
//     <div className="p-4">
//       <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 font-semibold">Supplier Name</label>
//           <Dropdown
//             value={selectedSupplier}
//             onChange={(e) => setSelectedSupplier(e.value)}
//             options={suppliers}
//             optionLabel="supplierName"
//             placeholder="Select Supplier"
//             className="w-full"
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Product Name</label>
//           <Dropdown
//             value={selectedProduct}
//             onChange={(e) => setSelectedProduct(e.value)}
//             options={products}
//             optionLabel="poName"
//             placeholder="Select Product"
//             className="w-full"
//           />
//         </div>
//       </div>

//       <div className="text-right mb-4">
//         <div className="inline-block text-right p-4 border rounded-md bg-gray-50 whitespace-pre-line">
//           <strong>Despatched From:</strong>
//           <br />
//           {dispatchedFrom}
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Product Name</label>
//           <Dropdown
//             value={selectedProduct}
//             onChange={(e) => setSelectedProduct(e.value)}
//             options={products}
//             optionLabel="poName"
//             placeholder="Select Product"
//             className="w-full"
//           />
//         </div>
//       </div>

//       <div className="text-right mb-4">
//         <div className="inline-block text-right p-4 border rounded-md bg-gray-50 whitespace-pre-line">
//           <strong>Despatched From:</strong>
//           <br />
//           {dispatchedFrom}
//         </div>

//       </div>

//       <DataTable value={products} showGridlines emptyMessage="No products found">
//         <Column field="poName" header="Name" />
//         <Column field="poDescription" header="Description" />
//         <Column field="poQuantity" header="Quantity" />
//         <Column field="poPrice" header="Price" />
//         <Column field="poDiscPercent" header="Disc %" />
//         <Column field="poDisc" header="Disc Amt" />
//         <Column field="poTotalPrice" header="Total" />
//       </DataTable>

//       <div className="flex justify-end gap-3 mt-4 print:hidden">

//         <Button label="Print Invoice" icon="pi pi-download" className="p-button-outlined p-button-success" onClick={handleDownloadPDF} />
//       </div>
//     </div>
//   )
// }

// export default AddNewPurchase;