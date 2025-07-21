import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import Barcode from 'react-barcode';
import { Button } from 'primereact/button';
import './PrintableSelection.css';

interface Product {
  poId: number;
  poName: string;
  poPrice: string;
  poTotalPrice: string;
  poHSN: string;
}

export default function BarcodePrint() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const formatPOINV = (id: number) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `POINV-${dd}-${mm}-${1000 + id}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products/read`, {
          headers: {
            Authorization: sessionStorage.getItem('token') || ''
          }
        });
        if (response.data.status) {
          setProducts(response.data.data);
        } else {
          console.warn('Failed to load products:', response.data.message);
        }
      } catch (err) {
        console.error('API Error:', err);
      }
    };
    fetchProducts();
  }, []);

  const handlePrint = () => {
    const printArea = document.getElementById('print-area');
    const printWindow = window.open('', '_blank');
    if (!printWindow || !printArea) return alert('Popup blocked or print area missing');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .barcode-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 16px;
            }
            .barcode-item {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: center;
              font-size: 14px;
              height: 150px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="p-4">
     <div className="flex items-center mb-3">
  <h2 className="text-2xl font-bold text-purple-800 m-0">Product Barcode Selection</h2>
  <div className="ml-auto">
    <Button
      label="Add to Print"
      className="p-button-sm p-button-primary"
      onClick={() => setSidebarVisible(true)}
      disabled={!selectedProducts.length}
    />
  </div>
</div>


      <DataTable
        value={products}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        selectionMode="multiple"
        dataKey="poId"
        stripedRows
        paginator
        rows={10}
        tableStyle={{ width: '100%' }}
        className="p-datatable-gridlines"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column field="poName" header="Product Name" />
        <Column field="poHSN" header="HSN (SKU)" />
        <Column
          field="poPrice"
          header="Price"
          body={(row) => `₹ ${parseFloat(row.poPrice).toFixed(2)}`}
        />
      </DataTable>

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: '50vw' }}
        className="p-sidebar-lg"
      >
      <div className="flex justify-between items-center mb-3">
  <h3 className="text-lg font-semibold text-purple-800 m-0">Print Preview</h3>
  <div className="ml-auto">
    <Button
      label="Print Stickers"
      icon="pi pi-print"
      className="p-button-sm p-button-primary"
      onClick={handlePrint}
    />
  </div>
</div>


        <div id="print-area" className="print-area">
          <div className="barcode-grid">
            {selectedProducts.map((p, i) => (
              <div className="barcode-item" key={i}>
                <strong>{p.poName}</strong>
                <Barcode value={p.poHSN} height={40} width={1} displayValue={false} />
                <div>{p.poHSN}</div>
                <div>₹ {parseFloat(p.poPrice).toFixed(2)}</div>
                <div>{formatPOINV(p.poId)}</div>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
