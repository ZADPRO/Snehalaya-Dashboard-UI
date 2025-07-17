import { useEffect, useState, useRef } from 'react'
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
  const printRef = useRef<HTMLDivElement>(null)

  const formatPOINV = (id: number) => {
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    return `POINV-${dd}-${mm}-${1000 + id}`
  }

  useEffect(() => {
    const mock: Product[] = Array.from({ length: 140 }, (_, i) => ({
      productId: i + 1,
      productName: `Product ${i + 1}`,
      sku: `SS-07-25-${(1000 + i).toString().padStart(4, '0')}`,
      price: Math.floor(Math.random() * 1000 + 100)
    }))
    setProducts(mock)
  }, [])

  const handlePrintBarcodes = () => {
    if (!selectedProducts.length) return

    const stickerHTML = selectedProducts
      .map((p) => {
        const barcodeSvg =
          document.getElementById(`barcode-svg-${p.productId}`)?.outerHTML ||
          '<div>Barcode missing</div>'
        const poinv = formatPOINV(p.productId)

        return `
        <div style="
          flex: 0 0 calc(25% - 8px);
          border: 1px solid #ccc;
          padding: 6px;
          text-align: center;
          page-break-inside: avoid;
        ">
          <div style="font-weight: bold; margin-bottom: 4px;">${p.productName}</div>
          ${barcodeSvg}
          <div style="margin-top: 2px;">${p.sku}</div>
          <div>₹ ${p.price.toFixed(2)}</div>
          <div>${poinv}</div>
        </div>
      `
      })
      .join('')

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcodes</title>
        </head>
        <body style="font-family: Arial, sans-serif; font-size: 10px; padding: 10px;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${stickerHTML}
          </div>
        </body>
      </html>
    `)

      printWindow.document.close()

      const interval = setInterval(() => {
        if (printWindow.document.readyState === 'complete') {
          clearInterval(interval)
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }
      }, 100)
    } else {
      alert('Failed to open print window')
    }
  }

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
        <div className="flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Print Preview</h3>
          <button className="p-button p-button-success mt-2" onClick={handlePrintBarcodes}>
            Print Stickers
          </button>
        </div>

        <div style={{ display: 'none' }}>
          {selectedProducts.map((p) => (
            <div key={p.productId}>
              <Barcode
                value={p.sku}
                height={35}
                width={1}
                displayValue={false}
                id={`barcode-svg-${p.productId}`}
                renderer="svg"
              />
            </div>
          ))}
        </div>
        <div ref={printRef}>
          <div className="barcode-grid">
            {selectedProducts.map((p, i) => (
              <div className="barcode-item" key={i}>
                <p>{p.productName}</p>
                <Barcode value={p.sku} height={30} width={1} displayValue={false} />
                <div className="sku">{p.sku}</div>
                <div className="price">₹ {p.price.toFixed(2)}</div>
                <div className="invoice">{formatPOINV(p.productId)}</div>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
