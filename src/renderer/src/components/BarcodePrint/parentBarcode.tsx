import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import Barcode from 'react-barcode'
import './PrintableSelection.css'

interface Product {
  productId: number
  productName: string
  sku: string
  price: number
}

export default function BarcodePrint() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  useEffect(() => {
    const mock: Product[] = Array.from({ length: 140 }, (_, i) => ({
      productId: i + 1,
      productName: `Product ${i + 1}`,
      sku: `SS-07-25-${(1000 + i).toString().padStart(4, '0')}`,
      price: Math.floor(Math.random() * 1000 + 100)
    }))
    setProducts(mock)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-4">
      <h2>Product Barcode Selection</h2>

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

      <div className="p-mt-3">
        <label>
          Invoice Number:
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="p-inputtext p-ml-2"
          />
        </label>
      </div>

      <button
        className="p-button p-mt-3"
        disabled={!selectedProducts.length}
        onClick={() => setSidebarVisible(true)}
      >
        Add to Print
      </button>

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: '400px' }}
      >
        <h3>Preview & Print</h3>
        <button className="p-button" onClick={handlePrint}>
          Print Preview
        </button>
      </Sidebar>

      {selectedProducts.length > 0 && (
        <div className="print-area">
          <div className="barcode-grid">
            {selectedProducts.map((p, i) => (
              <div className="barcode-item" key={i}>
                <strong>{p.productName}</strong>
                <Barcode value={p.sku} height={40} width={1} displayValue={false} />
                <div>{p.sku}</div>
                <div>₹ {p.price.toFixed(2)}</div>
                <div>{invoiceNumber}</div>
                <div>{currentMonthYear}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
