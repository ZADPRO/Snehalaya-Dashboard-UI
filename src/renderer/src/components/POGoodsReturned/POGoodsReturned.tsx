import React, { useEffect, useState, useRef } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import axios from 'axios'
import { Divider } from 'primereact/divider'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FileText, Download } from 'lucide-react'
import { debitInvoice1 } from '../../components/POGoodsReturned/debitinvoice'
import { Toast } from 'primereact/toast'


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

const POGoodsReturned: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  const [totalPaid, _setTotalPaid] = useState<number>(0)


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
  const [discount, setDiscount] = useState<number>(0)

  const toast = useRef<Toast>(null)

  const handleGenerateInvoice = () => {
    if (!selectedSupplier || !selectedBranch || productEntries.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Incomplete Data',
        detail: 'Please fill all required fields.',
        life: 3000
      })
      return
    }


    const formattedProducts = productEntries.map((entry) => ({
      poId: entry.product.productId,
      poName: entry.product.productName,
      poHSN: entry.product.hsnCode,
      poQuantity: entry.quantity.toString(),
      poPrice: entry.price.toFixed(2),
      poDiscPercent: entry.discount.toString(),
      poDisc: entry.discountPrice.toFixed(2),
      poTotalPrice: entry.totalPrice.toFixed(2),
      sku: entry.product.sku,
    }))

    try {
    debitInvoice1({
  supplier: selectedSupplier!,
  branch: selectedBranch!,
  productEntries: formattedProducts,
  creditedDate: creditedDate?.toLocaleDateString() ?? '',
  transport,
  subTotal,
  discountTotal,
  tax,
  total,
  totalPaid,
  pendingPayment,
});

      toast.current?.show({
        severity: 'success',
        summary: 'Invoice Generated',
        detail: 'Debit note has been generated successfully.',
        life: 3000
      })
    } catch (err) {
      console.error('PDF generation failed:', err)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong while generating the invoice.',
        life: 3000
      })

    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    axios
      .get('http://localhost:8080/api/v1/admin/suppliers/read', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setSuppliers(res.data.data))
      .catch(() => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load suppliers.', life: 3000 })
      })

    axios
      .get('http://localhost:8080/api/v1/admin/settings/branches', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setBranches(res.data.data))
      .catch(() => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load branches.', life: 3000 })
      })
  }, [])

  useEffect(() => {
    const currentDate = new Date()
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + creditedDays)
    setCreditedDate(newDate)
  }, [creditedDays])

  useEffect(() => {
    const mockProducts: Product[] = [
      { productId: 1, productName: 'Kanchipuram Silk Saree', hsnCode: '5007', sku: '' },
      { productId: 2, productName: 'Banarasi Saree', hsnCode: '5007', sku: '' },
      { productId: 3, productName: 'Chiffon Saree', hsnCode: '5407', sku: '' },
      { productId: 4, productName: 'Georgette Saree', hsnCode: '5408', sku: '' },
      { productId: 5, productName: 'Cotton Handloom Saree', hsnCode: '5208', sku: '' },
      { productId: 6, productName: 'Linen Saree', hsnCode: '5309', sku: '' },
      { productId: 7, productName: 'Tussar Silk Saree', hsnCode: '5007', sku: '' },
      { productId: 8, productName: 'Organza Saree', hsnCode: '5407', sku: '' }
    ]
    setProductList(mockProducts)
  }, [])

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0 || price <= 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Invalid Product Entry',
        detail: 'Please select a product and enter valid quantity and price.',
        life: 3000
      })
      return
    }

    const discountPrice = (price * discount) / 100
    const totalPrice = (price - discountPrice) * quantity
    const sku = generateSKU(productEntries.length)

    const entry: ProductEntry = {
      product: {
        ...selectedProduct,
        sku
      },
      quantity,
      price,
      discount,
      discountPrice,
      totalPrice
    }

    setProductEntries((prev) => [...prev, entry])


    setSelectedProduct(null)
    setQuantity(1)
    setPrice(0)
    setDiscount(0)
  }

  const generateSKU = (index: number): string => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(2)
    const serial = String(index + 1).padStart(4, '0')
    return `SS-${month}-${year}-${serial}`
  }

const subTotal = productEntries.reduce((sum, entry) => sum + entry.price * entry.quantity, 0)
const discountTotal = productEntries.reduce((sum, entry) => sum + entry.discountPrice * entry.quantity, 0)
const taxableAmount = subTotal - discountTotal
const tax = taxableAmount * 0.05
const total = taxableAmount + tax
const pendingPayment = total - totalPaid



  return (
    <div className="purchaseOrderCreationCard flex" style={{ width: '100%', height: '100%' }}>
      <Toast ref={toast} />
      {/* Left Section - Form */}
      <div className="creationCard" style={{ width: '80%' }}>
        <div className="flex">
          <div className="flex flex-column gap-3 p-4" style={{ width: '30%' }}>
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

            <span className="p-float-label always-float">
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


          <div className="flex flex-column gap-3 p-4 border-gray-300" style={{ width: '70%' }}>
            <h4>Preview</h4>

            <div className="flex justify-content-between">
              {selectedSupplier && (
                <div>
                  <strong>Dispatched From:</strong>
                  <p>
                    <strong>{selectedSupplier.supplierCompanyName}</strong> (
                    {selectedSupplier.supplierCode})
                  </p>
                  <p>
                    {selectedSupplier.supplierDoorNumber}, {selectedSupplier.supplierStreet},{' '}
                    {selectedSupplier.supplierCity}, {selectedSupplier.supplierState},{' '}
                    {selectedSupplier.supplierCountry}
                  </p>
                  <p>Email: {selectedSupplier.supplierEmail}</p>
                  <p>Mobile: {selectedSupplier.supplierContactNumber}</p>
                </div>
              )}

              {selectedBranch && (
                <div>
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

        <div className="addProductsPreview p-4 flex flex-column gap-3">
          <div className="flex gap-3">
            <span className="p-float-label always-float flex-1">
              <Dropdown
                inputId="product"
                value={selectedProduct}
                options={productList}
                onChange={(e) => setSelectedProduct(e.value)}
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
                className="w-10"
                suffix="%"
                min={0}
                max={100}
              />
              <label htmlFor="discount">Discount %</label>
            </span>
            <div className="flex align-items-end flex-1">
              <button type="button" className="p-button" onClick={handleAddProduct}>
                Add
              </button>
            </div>
          </div>

          <DataTable value={productEntries} tableStyle={{ minWidth: '50rem' }} stripedRows showGridlines>
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

      <div className="creationCard flex flex-column justify-content-between" style={{ width: '20%' }}>
        <div className="buttons p-3 flex flex-column gap-2">
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8', background: 'none', borderRadius: '6px' }}

          >

            <FileText size={18} /> Print DebitNote
          </p>

          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8' }}
             onClick={handleGenerateInvoice}
          >
            <Download size={18} /> Download
          </p>
        </div>
        <div className="Tax Summary p-3"></div>
        <Divider />
        <div className="mt-4">
          <h5 className="mb-3 font-bold">Tax Summary</h5>
          <div className="flex justify-content-between mb-2">
            <span>Tax Type</span>
            <span>GST</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Sub Total</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Discount</span>
            <span>₹{discountTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between mb-2">
            <strong>Total</strong>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
          <div className="flex justify-content-between mb-2">
            <span>Paid</span>
            <span>₹{totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-content-between">
            <strong>Pending Payment</strong>
            <strong>₹{pendingPayment.toFixed(2)}</strong>

          </div>
        </div>
      </div>
    </div>
  )
}

export default POGoodsReturned
