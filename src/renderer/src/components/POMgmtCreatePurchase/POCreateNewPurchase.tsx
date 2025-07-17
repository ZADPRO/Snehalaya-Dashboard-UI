import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import axios from 'axios'
import { Divider } from 'primereact/divider'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Download } from 'lucide-react'
// import { generateInvoice } from './InvoicePdf'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { InputSwitch } from 'primereact/inputswitch'

interface Supplier {
  supplierId: number
  supplierCompanyName: string
  supplierCode: string
  supplierEmail: string
  supplierContactNumber: string
  supplierDoorNumber: string
  supplierStreet: string
  supplierCity: string
  supplierState: string
  supplierCountry: string
}

interface Branch {
  refBranchId: number
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
}

interface Product {
  productId: number
  productName: string
  hsnCode: string
  sku: string
}

interface ProductEntry {
  product: Product
  quantity: number
  price: number
  discount: number
  discountPrice: number
  totalPrice: number
}

const POCreateNewPurchase: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  const toast = useRef<Toast>(null)

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [creditedDays, setCreditedDays] = useState<number>(0)
  const [creditedDate, setCreditedDate] = useState<Date | null>(null)

  const [transport, setTransport] = useState<string>('')

  const [productList, setProductList] = useState<Product[]>([])
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [price, setPrice] = useState<number>(0)

  const [totalPaid, setTotalPaid] = useState<number>(0)
  const [isTaxEnabled, setIsTaxEnabled] = useState<boolean>(false)

  const [discount, setDiscount] = useState<number>(0)

  const [canPrint, setCanPrint] = useState(false)
  console.log('canPrint', canPrint)
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null)
  const [hsnCode, setHsnCode] = useState<string>('')

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    axios
      .get('https://snehalayaa.brightoncloudtech.com/api/v1/admin/suppliers/read', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setSuppliers(res.data.data))

    axios
      .get('https://snehalayaa.brightoncloudtech.com/api/v1/admin/settings/branches', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setBranches(res.data.data))
  }, [])

  useEffect(() => {
    const currentDate = new Date()
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + creditedDays)
    setCreditedDate(newDate)
  }, [creditedDays])

  useEffect(() => {
    const localData = localStorage.getItem('products')
    if (localData) {
      const parsedProducts = JSON.parse(localData)
      const transformed = parsedProducts.map((p: any, index: number) => ({
        productId: index + 1,
        productName: p.poName,
        hsnCode: 'NA',
        sku: p.dummySKU,
        discount: parseFloat(p.poDiscPercent) || 0
      }))
      setProductList(transformed)
    }
  }, [])

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0 || price <= 0) return

    const discountPrice = (price * discount) / 100
    const totalPrice = (price - discountPrice) * quantity
    const sku = generateSKU(productEntries.length)

    const entry: ProductEntry = {
      product: {
        ...selectedProduct,
        sku,
        hsnCode: hsnCode || selectedProduct.hsnCode // <- Use user input if available
      },
      quantity,
      price,
      discount,
      discountPrice,
      totalPrice
    }

    setProductEntries((prev) => [...prev, entry])

    // Reset
    setSelectedProduct(null)
    setQuantity(1)
    setPrice(0)
    setDiscount(0)
    setHsnCode('') // <- Reset HSN
  }

  const handleSavePurchaseOrder = () => {
    if (!selectedSupplier || !selectedBranch || productEntries.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Data',
        detail: 'Please complete Supplier, Branch, and Product details.',
        life: 3000
      })
      return
    }

    const orderId = `PO-${Date.now()}`

    const orderData = {
      id: orderId,
      supplier: selectedSupplier,
      branch: selectedBranch,
      creditedDays,
      creditedDate,
      transport,
      productEntries,
      totalPaid,
      isTaxEnabled
    }

    const existingOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]')
    const updatedOrders = [...existingOrders, orderData]
    localStorage.setItem('purchaseOrders', JSON.stringify(updatedOrders))

    setSavedOrderId(orderId)
    setCanPrint(true)

    toast.current?.show({
      severity: 'success',
      summary: 'Saved',
      detail: `Purchase Order ${orderId} saved successfully.`,
      life: 3000
    })
  }

  const handlePrintInvoice = () => {
    if (!savedOrderId || !selectedSupplier || !selectedBranch) return

    const currentDateTime = new Date()
    const createdOn = `${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    const dueOn = creditedDate ? creditedDate.toLocaleDateString() : '-'

    const printContents = `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 14px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <h2 style="margin: 0;">SVAP TEXTILES LLP</h2>
          <p style="margin: 2px 0;">No 23, Venkatnarayana Road</p>
          <p style="margin: 2px 0;">T.Nagar, Chennai, Tamil Nadu</p>
          <p style="margin: 2px 0;">India - 600017</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">Purchase Order</h3>
          <p><strong>PO No:</strong> ${savedOrderId}</p>
          <p><strong>Created On:</strong> ${createdOn}</p>
          <p><strong>Due On:</strong> ${dueOn}</p>
        </div>
      </div>
      <hr/>

      <!-- Supplier Info -->
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <div>
          <h4>Supplier</h4>
          <p><strong>${selectedSupplier.supplierCompanyName}</strong> (${selectedSupplier.supplierCode})</p>
          <p>${selectedSupplier.supplierDoorNumber}, ${selectedSupplier.supplierStreet}</p>
          <p>${selectedSupplier.supplierCity}, ${selectedSupplier.supplierState}, ${selectedSupplier.supplierCountry}</p>
          <p>Email: ${selectedSupplier.supplierEmail}</p>
          <p>Mobile: ${selectedSupplier.supplierContactNumber}</p>
        </div>
        <div>
          <h4>Branch</h4>
          <p><strong>${selectedBranch.refBranchName}</strong> (${selectedBranch.refBranchCode})</p>
          <p>${selectedBranch.refLocation}</p>
          <p>Email: ${selectedBranch.refEmail}</p>
          <p>Mobile: ${selectedBranch.refMobile}</p>
        </div>
      </div>

      <!-- Dispatch Info -->
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <div>
          <h4>Dispatched From</h4>
          <p><strong>${selectedSupplier.supplierCompanyName}</strong> (${selectedSupplier.supplierCode})</p>
          <p>${selectedSupplier.supplierDoorNumber}, ${selectedSupplier.supplierStreet}</p>
          <p>${selectedSupplier.supplierCity}, ${selectedSupplier.supplierState}, ${selectedSupplier.supplierCountry}</p>
        </div>
        <div>
          <h4>Dispatched To</h4>
          <p><strong>${selectedBranch.refBranchName}</strong> (${selectedBranch.refBranchCode})</p>
          <p>${selectedBranch.refLocation}</p>
        </div>
      </div>

      <!-- Product Table -->
      <h4 style="margin-top: 30px;">Product Summary</h4>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" border="1">
        <thead style="background-color: #f0f0f0;">
          <tr>
            <th style="padding: 8px;">S.No</th>
            <th style="padding: 8px;">Product</th>
            <th style="padding: 8px;">HSN</th>
            <th style="padding: 8px;">Qty</th>
            <th style="padding: 8px;">SKU</th>
            <th style="padding: 8px;">Price</th>
            <th style="padding: 8px;">Disc %</th>
            <th style="padding: 8px;">Disc ₹</th>
            <th style="padding: 8px;">Total ₹</th>
          </tr>
        </thead>
        <tbody>
          ${productEntries
            .map(
              (item, idx) => `
                <tr>
                  <td style="padding: 8px; text-align: center;">${idx + 1}</td>
                  <td style="padding: 8px;">${item.product.productName}</td>
                  <td style="padding: 8px;">${item.product.hsnCode}</td>
                  <td style="padding: 8px; text-align: right;">${item.quantity}</td>
                  <td style="padding: 8px;">${item.product.sku}</td>
                  <td style="padding: 8px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right;">${item.discount}%</td>
                  <td style="padding: 8px; text-align: right;">₹${item.discountPrice.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right;">₹${item.totalPrice.toFixed(2)}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Transport & Dates -->
      <p style="margin-top: 20px;"><strong>Transport:</strong> ${transport || '-'}</p>
      <p><strong>Expected Date:</strong> ${creditedDate?.toLocaleDateString() || '-'}</p>

      <!-- Summary -->
      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> ₹${subTotal.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹${discountTotal.toFixed(2)}</p>
        <p><strong>Tax (5%):</strong> ₹${tax.toFixed(2)}</p>
        <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
        <p><strong>Paid:</strong> ₹${totalPaid.toFixed(2)}</p>
        <p style="font-weight: bold; color: red;"><strong>Pending:</strong> ₹${pendingPayment.toFixed(2)}</p>
      </div>

      <hr />
      <p style="text-align:center;">Thanks for using Snehalayaa Purchase Management</p>
    </div>
  `

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Purchase Invoice</title>
        </head>
        <body>${printContents}</body>
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

  const generateSKU = (index: number): string => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(2)
    const serial = String(index + 1).padStart(4, '0')
    return `SS-${month}-${year}-${serial}`
  }

  const subTotal = productEntries.reduce((sum, entry) => sum + entry.price * entry.quantity, 0)
  const discountTotal = productEntries.reduce(
    (sum, entry) => sum + entry.discountPrice * entry.quantity,
    0
  )
  const taxableAmount = subTotal - discountTotal
  const tax = isTaxEnabled ? (taxableAmount * 5) / 100 : 0
  const total = taxableAmount + tax
  const pendingPayment = total - totalPaid

  return (
    <div className="purchaseOrderCreationCard flex" style={{ width: '100%', height: '100%' }}>
      {/* Left Section - Form */} <Toast ref={toast} />
      <div className="creationCard" style={{ width: '80%' }}>
        <div className="flex gap-3">
          <div className="flex flex-column gap-3 p-1" style={{ width: '30%' }}>
            {/* Float Label Input Fields */}
            <span className="p-float-label always-float">
              <Dropdown
                id="supplier"
                value={selectedSupplier}
                options={suppliers}
                onChange={(e) => setSelectedSupplier(e.value)}
                optionLabel="supplierCompanyName"
                className="w-full"
              />
              <label htmlFor="supplier">Supplier</label>
            </span>

            <span className="p-float-label always-float">
              <Dropdown
                id="branch"
                value={selectedBranch}
                options={branches}
                onChange={(e) => setSelectedBranch(e.value)}
                optionLabel="refBranchName"
                className="w-full"
              />
              <label htmlFor="branch">Branch</label>
            </span>

            <span className="p-float-label always-float">
              <InputNumber
                id="creditedDays"
                value={creditedDays}
                onValueChange={(e) => setCreditedDays(e.value ?? 0)}
                useGrouping={false}
                className="w-full"
              />
              <label htmlFor="creditedDays">Credited Days</label>
            </span>

            <span className="p-float-label always-float hidden">
              <Calendar
                id="creditedDate"
                value={creditedDate}
                onChange={(e) => setCreditedDate(e.value as Date)}
                className="w-full"
                dateFormat="dd-mm-yy"
              />
              <label htmlFor="creditedDate">Expected Date</label>
            </span>

            <span className="p-float-label always-float">
              <InputText
                id="transport"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full"
              />
              <label htmlFor="transport">Transport</label>
            </span>
          </div>

          <Divider layout="vertical" />

          {/* Right Section - Preview */}
          <div className="flex flex-column gap-3 p-4 border-gray-300" style={{ width: '70%' }}>
            <h4>Preview</h4>

            <div className="flex justify-content-between">
              {selectedSupplier && (
                <div className="">
                  <strong>Dispatched From:</strong>
                  <p>
                    <strong>{selectedSupplier.supplierCompanyName}</strong> (
                    {selectedSupplier.supplierCode})
                  </p>
                  <p>
                    {selectedSupplier.supplierDoorNumber}, {selectedSupplier.supplierStreet},
                    {selectedSupplier.supplierCity}, {selectedSupplier.supplierState},{' '}
                    {selectedSupplier.supplierCountry}
                  </p>
                  <p>Email: {selectedSupplier.supplierEmail}</p>
                  <p>Mobile: {selectedSupplier.supplierContactNumber}</p>
                </div>
              )}

              {selectedBranch && (
                <div className="">
                  <strong>Dispatched To:</strong>
                  <p>
                    <strong>{selectedBranch.refBranchName}</strong> ({selectedBranch.refBranchCode})
                  </p>
                  <p>{selectedBranch.refLocation}</p>
                  <p>Email: {selectedBranch.refEmail}</p>
                  <p>Mobile: {selectedBranch.refMobile}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {creditedDate && (
                <div className="flex gap-2">
                  <strong>Expected Date:</strong>
                  <p>{creditedDate.toLocaleDateString()}</p>
                </div>
              )}

              {transport && (
                <div className="flex gap-2">
                  <strong>Transport:</strong>
                  <p>{transport}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="addProductsPreview p-1 mt-3 flex flex-column gap-3">
          <div className="flex gap-3">
            <span className="p-float-label always-float flex-1">
              <Dropdown
                inputId="product"
                value={selectedProduct}
                options={productList}
                onChange={(e) => {
                  setSelectedProduct(e.value)
                  setDiscount(e.value.discount || 0)
                }}
                optionLabel="productName"
                className="w-full"
              />
              <label htmlFor="product">Product</label>
            </span>

            <span className="p-float-label always-float flex-1">
              <InputNumber
                inputId="quantity"
                value={quantity}
                onValueChange={(e) => setQuantity(e.value ?? 1)}
                className="w-full"
                useGrouping={false}
              />
              <label htmlFor="quantity">Qty</label>
            </span>

            <span className="p-float-label always-float flex-1">
              <InputNumber
                inputId="price"
                value={price}
                onValueChange={(e) => setPrice(e.value ?? 0)}
                className="w-full"
                mode="currency"
                currency="INR"
                locale="en-IN"
              />
              <label htmlFor="price">Price</label>
            </span>

            <span className="p-float-label always-float flex-1">
              <InputNumber
                inputId="discount"
                value={discount}
                onValueChange={(e) => setDiscount(e.value ?? 0)}
                className="w-full"
                suffix="%"
                min={0}
                max={100}
              />
              <label htmlFor="discount">Discount %</label>
            </span>

            <span className="p-float-label always-float flex-1">
              <InputText
                id="hsnCode"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full"
              />
              <label htmlFor="hsnCode">HSN Code</label>
            </span>

            <div className="flex align-items-end flex-1">
              <button type="button" className="p-button" onClick={handleAddProduct}>
                Add
              </button>
            </div>
          </div>

          <Divider />

          <DataTable
            value={productEntries}
            tableStyle={{ minWidth: '50rem' }}
            stripedRows
            showGridlines
          >
            <Column header="S.No" body={(_, idx) => idx.rowIndex + 1} />
            <Column header="Product" field="product.productName" />
            <Column header="HSN Code" field="product.hsnCode" />
            <Column header="Qty" field="quantity" />
            <Column header="SKU" field="product.sku" />
            <Column header="Price" body={(row) => `₹${row.price.toFixed(2)}`} />
            <Column header="Discount %" field="discount" />
            <Column header="Discount ₹" body={(row) => `₹${row.discountPrice.toFixed(2)}`} />
            <Column header="Total ₹" body={(row) => `₹${row.totalPrice.toFixed(2)}`} />
          </DataTable>
        </div>
      </div>
      <Divider layout="vertical" />
      {/* Right Sidebar Buttons */}
      <div
        className="creationCard flex flex-column justify-content-between"
        style={{ width: '20%' }}
      >
        <div className="buttons p-3 flex flex-column gap-2">
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8' }}
            onClick={handleSavePurchaseOrder}
          >
            <Download size={18} /> Save Invoice
          </p>
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8' }}
            onClick={handlePrintInvoice}
          >
            <Download size={18} /> Print Invoice
          </p>
        </div>
        <div className="totalSummary p-3">
          <span className="p-float-label always-float mb-3">
            <InputNumber
              inputId="payAmount"
              value={totalPaid}
              onValueChange={(e) => setTotalPaid(e.value ?? 0)}
              mode="currency"
              currency="INR"
              locale="en-IN"
              className="w-full"
            />
            <label htmlFor="payAmount">Pay Amount</label>
          </span>
          <Divider />
          <div className="flex justify-content-between mb-2 mt-5">
            <span>Sub Total</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Discount</span>
            <span>₹{discountTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between align-items-center mb-2">
            <span>Apply Tax (5%)</span>
            <InputSwitch checked={isTaxEnabled} onChange={(e) => setIsTaxEnabled(e.value)} />
          </div>
          <div className="flex justify-content-between font-bold mb-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Total Paid</span>
            <span>₹{totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between text-red-500 font-medium">
            <span>Pending Payment</span>
            <span>₹{pendingPayment.toFixed(2)}</span>
          </div>
        </div>{' '}
      </div>
    </div>
  )
}

export default POCreateNewPurchase
