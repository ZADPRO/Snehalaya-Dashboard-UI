import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import Barcode from 'react-barcode';
import './PrintableSelection.css';

interface Product {
  productId: number;
  productName: string;
  sku: string;
  price: number;
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
    const mock: Product[] = Array.from({ length: 140 }, (_, i) => ({
      productId: i + 1,
      productName: `Product ${i + 1}`,
      sku: `SS-07-25-${(1000 + i).toString().padStart(4, '0')}`,
      price: Math.floor(Math.random() * 1000 + 100),
    }));
    setProducts(mock);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <h2>Product Barcode Selection</h2>

      <div className="flex justify-content-end mb-3">
        <button
          className="p-button p-button-sm"
          disabled={!selectedProducts.length}
          onClick={() => setSidebarVisible(true)}
        >
          Add to Print
        </button>
      </div>
      <DataTable
        value={products}
        selectionMode="multiple"
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="productId"
        stripedRows
        paginator
        rows={20}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode="multiple" style={{ width: '3em' }} />
        <Column field="productName" header="Name" />
        <Column field="sku" header="SKU" />
        <Column field="price" header="Price" body={(row) => `₹ ${row.price}`} />
      </DataTable>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: '50vw' }}
        className="p-sidebar-lg"
      >
       <div className="flex justify-content-around align-items-center mb-3">
        <h3 className="m-0">Print Preview</h3>
        <div style={{ flex: 1 }} /> {/* spacer in the middle */}
        <button className="p-button p-button-success mt-2" onClick={handlePrint}>Print Stickers</button>
      </div>

        <div className="print-area flex flex-column gap-4"> 
          <div className="barcode-grid">
            {selectedProducts.map((p, i) => (
              <div className="barcode-item" key={i}>
                <strong>{p.productName}</strong>
                <Barcode value={p.sku} height={40} width={1} displayValue={false} />
                <div>{p.sku}</div>
                <div>₹ {p.price.toFixed(2)}</div>
                <div>{formatPOINV(p.productId)}</div>
              </div>
            ))}
          </div>
          
        </div>
      </Sidebar>
    </div>
  );
}
