import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Dropdown } from 'primereact/dropdown'

import './PO.css'

interface PO {
  id: number
  customerName: string
  poStatus: 'New' | 'In Progress' | 'Complete'
  paymentStatus: 'Pending Payment' | 'Paid'
  createdAt: string
  createdBy: string
  totalAmount: number
}

const POMgmtViewPurchase: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PO[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null)
  const toast = useRef<Toast>(null)

  const formatPOINV = (id: number) => {
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    return `POINV-${dd}-${mm}-${1000 + id}`
  }

  useEffect(() => {
    setPurchaseOrders([
      {
        id: 1,
        customerName: 'Ravi Kumar',
        poStatus: 'Complete',
        paymentStatus: 'Paid',
        createdAt: '2025-07-01 10:15 AM',
        createdBy: 'Admin',
        totalAmount: 25000
      },
      {
        id: 2,
        customerName: 'Meena Textiles',
        poStatus: 'In Progress',
        paymentStatus: 'Pending Payment',
        createdAt: '2025-07-05 3:40 PM',
        createdBy: 'Admin',
        totalAmount: 17500
      },
      {
        id: 3,
        customerName: 'Varun Stores',
        poStatus: 'New',
        paymentStatus: 'Pending Payment',
        createdAt: '2025-07-09 11:20 AM',
        createdBy: 'Admin',
        totalAmount: 9000
      }
    ])
  }, [])

  const statusBody = (row: PO) => (
    <Tag
      value={row.poStatus}
      severity={
        row.poStatus === 'Complete'
          ? 'success'
          : row.poStatus === 'In Progress'
            ? 'warning'
            : 'info'
      }
    />
  )

  const paymentStatusBody = (row: PO) => (
    <Tag value={row.paymentStatus} severity={row.paymentStatus === 'Paid' ? 'success' : 'danger'} />
  )

  const actionBody = (row: PO) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() =>
          toast.current?.show({
            severity: 'info',
            summary: 'Edit Action',
            detail: `Editing PO: ${formatPOINV(row.id)}`
          })
        }
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        onClick={() => {
          setPurchaseOrders((ps) => ps.filter((p) => p.id !== row.id))
          toast.current?.show({
            severity: 'warn',
            summary: 'Deleted',
            detail: `Removed ${formatPOINV(row.id)}`
          })
        }}
      />
    </div>
  )

  const header = (
    <div className="flex flex-column md:flex-row justify-content-between w-full gap-2">
      <div className="w-full md:w-4">
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by customer name"
            className="w-full"
          />
        </IconField>
      </div>
      <Dropdown
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.value)}
        options={['New', 'In Progress', 'Complete']}
        placeholder="Status"
        showClear
      />
      <Dropdown
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.value)}
        options={['Pending Payment', 'Paid']}
        placeholder="Payment Status"
        showClear
      />
    </div>
  )

  const filteredData = purchaseOrders.filter((po) => {
    return (
      (!globalFilter || po.customerName.toLowerCase().includes(globalFilter.toLowerCase())) &&
      (!statusFilter || po.poStatus === statusFilter) &&
      (!paymentFilter || po.paymentStatus === paymentFilter)
    )
  })

  return (
    <div className="card">
      <h3 className="mb-3">Snehalayaa Silks - Purchase Orders</h3>
      <Toast ref={toast} />
      <Toolbar className="mb-3" right={header} />

      <DataTable
        value={filteredData}
        paginator
        rows={10}
        showGridlines
        rowsPerPageOptions={[10, 25, 50]}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        emptyMessage="No Purchase Orders"
        responsiveLayout="scroll"
      >
        <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} style={{ width: '60px' }} />
        <Column header="PO Invoice No" body={(row) => formatPOINV(row.id)} sortable />
        <Column field="customerName" header="Customer Name" sortable />
        <Column header="Status" body={statusBody} sortable />
        <Column header="Payment Status" body={paymentStatusBody} sortable />
        <Column field="totalAmount" header="Total Amount" sortable />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
        <Column header="Actions" body={actionBody} style={{ width: '150px' }} />
      </DataTable>
    </div>
  )
}

export default POMgmtViewPurchase
