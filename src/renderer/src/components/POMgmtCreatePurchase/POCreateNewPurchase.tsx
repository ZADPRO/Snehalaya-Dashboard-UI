import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import axios from 'axios'
import { Divider } from 'primereact/divider'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Download, FileText, Printer } from 'lucide-react'
import { generateInvoice } from './InvoicePdf'
import { Toast } from 'primereact/toast';
import { useRef } from 'react';


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

  const [totalPaid, setTotalPaid] = useState<number>(0)
  const toast = useRef<Toast>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);



  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [creditedDays, setCreditedDays] = useState<number>(0)
  const [creditedDate, setCreditedDate] = useState<Date | null>(null)

  const [transport, setTransport] = useState<string>('')

  const [productList, setProductList] = useState<Product[]>([])
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([])
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [price, setPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    axios
      .get('http://localhost:8080/api/v1/admin/suppliers/read', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setSuppliers(res.data.data))

    axios
      .get('http://localhost:8080/api/v1/admin/settings/branches', {
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
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/v1/admin/products/read', {
          headers: { Authorization: token || '' },
        });
        console.log('Products:', res.data.data);
        if (res.data.data) {
          const formattedProducts = res.data.data.map((item: any) => ({
            productId: item.poId,
            productName: item.poName,
            hsnCode: item.poHSN,
            sku: item.poSKU
          }));
          setProductList(formattedProducts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0 || price <= 0) return

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

    // Reset
    setSelectedProduct(null)
    setQuantity(1)
    setPrice(0)
    setDiscount(0)
  }
  const handleDownloadInvoice = async () => {
    if (!selectedSupplier || !selectedBranch || productEntries.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select supplier, branch, and add at least one product.',
        life: 3000,
      });
      return;
    }

    setIsDownloading(true);

    try {
      const pdfProducts = productEntries.map((entry) => ({
        poId: entry.product.productId,
        poName: entry.product.productName,
        poHSN: entry.product.hsnCode,
        poQuantity: entry.quantity.toString(),
        poPrice: entry.price.toFixed(2),
        poDiscPercent: entry.discount.toFixed(2),
        poDisc: entry.discountPrice.toFixed(2),
        poTotalPrice: entry.totalPrice.toFixed(2),
        posku: entry.product.sku,
      }));

      const doc = await generateInvoice(
        selectedSupplier,
        selectedBranch,
        pdfProducts,
        creditedDate
      );

     
      doc.save(`Invoice-${Date.now()}.pdf`);
    } catch (error) {

      console.error('Invoice generation error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate invoice.',
        life: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);


const handlePrintInvoice = async () => {
  setIsPrinting(true);

  try {
    const pdfProducts = productEntries.map((entry) => ({
      poId: entry.product.productId,
      poName: entry.product.productName,
      poHSN: entry.product.hsnCode,
      poQuantity: entry.quantity.toString(),
      poPrice: entry.price.toFixed(2),
      poDiscPercent: entry.discount.toFixed(2),
      poDisc: entry.discountPrice.toFixed(2),
      poTotalPrice: entry.totalPrice.toFixed(2),
      posku: entry.product.sku,
    }));

    const doc = await generateInvoice(
      selectedSupplier,
      selectedBranch,
      pdfProducts,
      creditedDate
    );


    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl, '_blank');
    printWindow?.focus();
    printWindow?.print();

  } catch (error) {
    console.error('Print error:', error);
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to print invoice.',
      life: 3000,
    });
  } finally {
    setIsPrinting(false);
  }
};

  





  

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
  const tax = 0
  const total = subTotal - discountTotal + tax
  const pendingPayment = total - totalPaid

  return (
    <div className="purchaseOrderCreationCard flex" style={{ width: '100%', height: '100%' }}>
      {/* Left Section - Form */} <Toast ref={toast} />

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
              <div className="flex justify-content-between mb-2">
                <span>Total Paid</span>
                <span>₹{totalPaid.toFixed(2)}</span>
              </div>
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

        <div className="addProductsPreview p-4 flex flex-column gap-3">
          <div className="flex gap-3">
            <span className="p-float-label always-float flex-1">
              <Dropdown
                id="product"
                value={selectedProduct}
                options={productList}
                onChange={(e) => setSelectedProduct(e.value)}
                optionLabel="productName"
                placeholder="Select Product"
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

            <div className="flex align-items-end flex-1">
              <button type="button" className="p-button" onClick={handleAddProduct}>
                Add
              </button>
            </div>
          </div>

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
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2 p-button-info"
            style={{
              border: '1px solid #1f8ceb',
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? 'none' : 'auto',
            }}
            onClick={() => !isPrinting && handlePrintInvoice()}
          >
            {isPrinting ? (
              <>
                <i className="pi pi-spin pi-spinner" />
                Preparing Print...
              </>
            ) : (
              <>
                <i className="pi pi-print" />
                Print Invoice
              </>
            )}
          </p>
          {/* {showModal && pdfUrl && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: '#fff',
                  width: '80%',
                  height: '90%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <button
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1001,
                  }}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
<iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="Invoice Preview"
        sandbox="allow-same-origin allow-scripts allow-modals allow-forms"
      ></iframe> 

                {/* <object
                  data={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>Your browser does not support PDFs.
                    <a href={pdfUrl} target="_blank">Download the PDF</a>.</p>
                </object> */}


                {/* <div style={{ textAlign: 'center', padding: '10px' }}>
                  <button
                    className="p-button p-button-success"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      iframe?.contentWindow?.print();
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          )} */} 

          {/* <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8' }}
          >
            <FileText size={18} /> Create Invoice
          </p> */}
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2 p-button-success"
            style={{ border: '1px solid #8e5ea8', opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
            onClick={() => !loading && handleDownloadInvoice()}
          >
            {loading ? (
              <>
                <i className="pi pi-spin pi-spinner" />
                Generating Invoice...
              </>
            ) : (
              <>
                <Download size={18} />
                Download Invoice
              </>
            )}
          </p>
          {/* <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{ border: '1px solid #8e5ea8' }}
          >
            <StickyNote size={18} /> Notes
          </p> */}
        </div>
        <div className="totalSummary p-3">
          <Divider />
          <div className="flex justify-content-between mb-2 mt-5">
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
