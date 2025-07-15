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

  // Format invoice number
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

      {/* Button on right */}
      <div className="flex justify-content-end mb-3">
        <button
          className="p-button p-button-sm"
          disabled={!selectedProducts.length}
          onClick={() => setSidebarVisible(true)}
        >
          Add to Print
        </button>
      </div>

      {/* Product Table */}
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

      {/* Print Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: '50vw' }}
        className="p-sidebar-lg"
      >
        <h3>Print Preview</h3>
        <div className="print-area flex flex-column gap-4">
          {/* Top Half: Barcode Stickers */}
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

          {/* Bottom Half: Actions */}
          <div className="flex justify-content-center">
            <button className="p-button p-button-success" onClick={handlePrint}>
              Print Stickers
            </button>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
