import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../../assets/logo/invoice.png'
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number
    }
  }
}

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

interface ProductEntry {
  poId: number
  poName: string
  poHSN: string
  poQuantity: string
  poPrice: string
  poDiscPercent: string
  poDisc: string
  poTotalPrice: string
  sku: string
}

interface InvoiceParams {
  supplier: Supplier
  branch: Branch
  productEntries: ProductEntry[]
  creditedDate: string
  transport: string
  subTotal: number
  discountTotal: number
  tax: number
  total: number
  totalPaid: number
  pendingPayment: number
}

export const debitInvoice1 = async ({
  supplier,
  branch,
  productEntries,
  creditedDate,
  transport,
  subTotal,
  discountTotal,
  tax,
  total,
  totalPaid,
  pendingPayment
}: InvoiceParams) => {
  console.log('transport', transport)
  const doc = new jsPDF()
  const base64Logo = await getImageBase64(logo)

  doc.addImage(base64Logo, 'PNG', 12, 5, 50, 35)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('SNEHALAYAA SILKS', 14, 40)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('SVAP TEXTILES LLP', 14, 45)
  doc.text('No.23, Venkatanarayana Road, T.Nagar,', 14, 50)
  doc.text('Chennai, Tamil Nadu, India - 600017', 14, 55)
  doc.text('GST No: 33AFDFS4445R1ZG', 14, 60)
  doc.text(`Supplier Ref: ${supplier.supplierCode}`, 14, 65)

  doc.setFont('helvetica', 'bold')
  doc.text('Debit Note', 180, 15, { align: 'right' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Created On: ${new Date().toLocaleString()}`, 180, 20, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.text('Dispatched From:', 14, 75)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(supplier.supplierCompanyName, 14, 80)
  doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 14, 85)
  doc.text(`${supplier.supplierCity}, ${supplier.supplierState}, India`, 14, 90)
  doc.text(`Email: ${supplier.supplierEmail}`, 14, 95)
  doc.text(`Mobile: ${supplier.supplierContactNumber}`, 14, 100)

  doc.setFont('helvetica', 'bold')
  doc.text('Dispatched To:', 135, 75)
  doc.setFont('helvetica', 'normal')
  doc.text(branch.refBranchName, 135, 80)
  doc.text(branch.refLocation, 135, 85)
  doc.text(`Email: ${branch.refEmail}`, 135, 90)
  doc.text(`Mobile: ${branch.refMobile}`, 135, 95)
  doc.text(`Expected Date: ${creditedDate}`, 135, 100)

  doc.setFont('helvetica', 'bold')
  doc.text('Supplier Detail', 127, 35)
  doc.setFont('helvetica', 'normal')
  if (supplier) {
    doc.text(supplier.supplierCompanyName, 130, 40)
    doc.text(`Membership Number: ${supplier.supplierCode}`, 130, 45)
    doc.text(`${supplier.supplierDoorNumber}, ${supplier.supplierStreet}`, 130, 50)
    doc.text(
      `${supplier.supplierCity}, ${supplier.supplierState}, ${supplier.supplierCountry}`,
      130,
      55
    )
    doc.text(`Email: ${supplier.supplierEmail}`, 130, 60)
    doc.text(`Mobile: ${supplier.supplierContactNumber}`, 130, 65)
  }

  const columns = [
    { header: 'S.No', dataKey: 'slno' },
    { header: 'Product', dataKey: 'poName' },
    { header: 'HSN', dataKey: 'poHSN' },
    { header: 'Qty', dataKey: 'poQuantity' },
    { header: 'Price', dataKey: 'poPrice' },
    { header: 'Disc%', dataKey: 'poDiscPercent' },
    { header: 'Discount', dataKey: 'poDisc' },
    { header: 'Amount', dataKey: 'poTotalPrice' },
    { header: 'SKU', dataKey: 'sku' }
  ]

  const data = productEntries.map((entry, i) => ({
    slno: i + 1,
    ...entry
  }))

  autoTable(doc, {
    startY: 110,
    columns,
    body: data,
    styles: { fontSize: 8, textColor: '#000000' },
    headStyles: {
      fillColor: false,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    didDrawPage: (data) => {
      const pageSize = doc.internal.pageSize
      const pageCount = (doc as any).internal.getNumberOfPages()

      doc.setFontSize(8)
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageSize.width / 2,
        pageSize.height - 10,
        { align: 'center' }
      )
    }
  })

  const summaryStartY = (doc.lastAutoTable?.finalY ?? 110) + 10
  const summaryColumns = [
    { header: 'Sub Total', dataKey: 'subTotal' },
    { header: 'Discount', dataKey: 'discount' },
    { header: 'Tax (5%)', dataKey: 'tax' },
    { header: 'Total', dataKey: 'total' },
    { header: 'Total Paid', dataKey: 'totalPaid' },
    { header: 'Pending Payment', dataKey: 'pendingPayment' }
  ]

  const summaryData = [
    {
      subTotal: subTotal.toFixed(2),
      discount: discountTotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      pendingPayment: pendingPayment.toFixed(2)
    }
  ]
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Summary', 14, summaryStartY + 1)
  autoTable(doc, {
    startY: summaryStartY + 3,
    columns: summaryColumns,
    body: summaryData,
    styles: { fontSize: 7 },
    headStyles: {
      fillColor: false, // disables header background color
      textColor: [0, 0, 0], // black text
      fontStyle: 'bold'
    },
    columnStyles: {
      subTotal: { halign: 'left' },
      discount: { halign: 'left' },
      tax: { halign: 'left' },
      total: { halign: 'left' },
      totalPaid: { halign: 'left' },
      pendingPayment: { halign: 'left' }
    },
    tableWidth: 'auto'
  })

  doc.save(`debit-note-${Date.now()}.pdf`)
}

const getImageBase64 = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
    img.onerror = reject
  })
