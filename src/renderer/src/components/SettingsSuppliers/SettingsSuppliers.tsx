// import React, { useEffect, useRef, useState } from 'react'
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
// import { Button } from 'primereact/button'
// import { InputText } from 'primereact/inputtext'
// import { Toolbar } from 'primereact/toolbar'
// import { IconField } from 'primereact/iconfield'
// import { InputIcon } from 'primereact/inputicon'
// import { Sidebar } from 'primereact/sidebar'
// import { Toast } from 'primereact/toast'
// import axios from 'axios'
// import SettingsAddNewSupplier from './SettingsAddNewSupplier'

// interface Supplier {}

// const SettingsSuppliers: React.FC = () => {
//   const [suppliers, setSuppliers] = useState<Supplier[]>([])
//   const [globalFilter, setGlobalFilter] = useState<string>('')
//   const [visibleRight, setVisibleRight] = useState(false)
//   const [editData, setEditData] = useState<Supplier | null>(null)
//   const [mode, setMode] = useState<'add' | 'edit'>('add')

//   const dtRef = useRef<DataTable<Supplier[]>>(null)
//   const toast = useRef<Toast>(null)

//   useEffect(() => {
//     fetchSuppliers()
//   }, [])

//   const fetchSuppliers = async () => {
//     try {
//       const resp = await axios.get(`${import.meta.env.VITE_API_URL}/admin/suppliers/read`, {
//         headers: {
//           Authorization: sessionStorage.getItem('token') || ''
//         }
//       })
//       if (resp.data.status) {
//         setSuppliers(resp.data.data)
//       } else {
//         toast.current?.show({
//           severity: 'warn',
//           summary: 'Warning',
//           detail: resp.data.message || 'Could not fetch suppliers',
//           life: 3000
//         })
//       }
//     } catch (err: any) {
//       toast.current?.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Fetch Failed',
//         life: 3000
//       })
//     }
//   }

//   const handleSave = async (supplier: Supplier) => {
//     try {
//       const resp = await axios.post(
//         `${import.meta.env.VITE_API_URL}/admin/suppliers/create`,
//         supplier,
//         { headers: { Authorization: sessionStorage.getItem('token') || '' } }
//       )
//       if (resp.data.status) {
//         fetchSuppliers()
//         toast.current?.show({
//           severity: 'success',
//           summary: 'Added',
//           detail: resp.data.message || 'Supplier added successfully',
//           life: 3000
//         })
//         setVisibleRight(false)
//       } else {
//         toast.current?.show({
//           severity: 'warn',
//           summary: 'Duplicate Failed to create',
//           detail: resp.data.message,
//           life: 3000
//         })
//       }
//     } catch (err: any) {
//       toast.current?.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Create failed',
//         life: 3000
//       })
//     }
//   }

//   const handleUpdate = async (supplier: Supplier) => {
//     try {
//       const resp = await axios.put(
//         `${import.meta.env.VITE_API_URL}/admin/suppliers/update`,
//         supplier,
//         { headers: { Authorization: sessionStorage.getItem('token') || '' } }
//       )
//       if (resp.data.status) {
//         fetchSuppliers()
//         toast.current?.show({
//           severity: 'success',
//           summary: 'Updated',
//           detail: resp.data.message || 'Supplier updated successfully',
//           life: 3000
//         })
//         setVisibleRight(false)
//       } else {
//         toast.current?.show({
//           severity: 'warn',
//           summary: 'Duplicate Failed to update',
//           detail: resp.data.message,
//           life: 3000
//         })
//       }
//     } catch (err: any) {
//       toast.current?.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Update failed',
//         life: 3000
//       })
//     }
//   }

//   const handleDelete = async (id: number) => {
//     try {
//       const resp = await axios.delete(
//         `${import.meta.env.VITE_API_URL}/admin/suppliers/delete/${id}`,
//         { headers: { Authorization: sessionStorage.getItem('token') || '' } }
//       )
//       if (resp.data.status) {
//         fetchSuppliers()
//         toast.current?.show({
//           severity: 'success',
//           summary: 'Deleted',
//           detail: resp.data.message || 'Supplier deleted',
//           life: 3000
//         })
//       } else {
//         toast.current?.show({
//           severity: 'warn',
//           summary: 'Failed',
//           detail: resp.data.message,
//           life: 3000
//         })
//       }
//     } catch (err: any) {
//       toast.current?.show({
//         severity: 'error',
//         summary: 'Error',
//         detail: err.response?.data?.message || 'Delete failed',
//         life: 3000
//       })
//     }
//   }

//   const exportExcel = () => dtRef.current?.exportCSV()

//   const leftHeader = (
//     <div className="flex gap-2 items-center">
//       <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
//       <Button
//         icon="pi pi-plus"
//         onClick={() => {
//           setMode('add')
//           setEditData(null)
//           setVisibleRight(true)
//         }}
//       />
//       <Button icon="pi pi-refresh" severity="secondary" onClick={fetchSuppliers} />
//     </div>
//   )

//   const rightHeader = (
//     <IconField iconPosition="left">
//       <InputIcon className="pi pi-search" />
//       <InputText
//         placeholder="Search"
//         value={globalFilter}
//         onChange={(e) => setGlobalFilter(e.target.value)}
//         className="w-25rem"
//       />
//     </IconField>
//   )

//   const actionBodyTemplate = (row: Supplier) => (
//     <div className="flex gap-2">
//       <Button
//         icon="pi pi-pencil"
//         rounded
//         text
//         onClick={() => {
//           setEditData(row)
//           setMode('edit')
//           setVisibleRight(true)
//         }}
//       />
//       <Button
//         icon="pi pi-trash"
//         rounded
//         text
//         severity="danger"
//         onClick={() => handleDelete(row.supplierId!)}
//       />
//     </div>
//   )

//   return (
//     <div className="card">
//       <Toast ref={toast} />
//       <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />
//       <DataTable
//         ref={dtRef}
//         value={suppliers}
//         paginator
//         rows={10}
//         rowsPerPageOptions={[10, 25, 50]}
//         scrollable
//         showGridlines
//         globalFilter={globalFilter}
//         sortMode="multiple"
//         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//         currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
//         emptyMessage="No suppliers found."
//         className="p-datatable-sm"
//       >
//         <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
//         <Column field="supplierName" header="Name" sortable />
//         <Column field="supplierCompanyName" header="Company" sortable />
//         <Column field="supplierCode" header="Code" sortable />
//         <Column field="supplierEmail" header="Email" sortable />
//         <Column field="supplierContactNumber" header="Contact" sortable />
//         <Column field="supplierCity" header="City" sortable />
//         <Column field="supplierCountry" header="Country" sortable />
//         <Column field="supplierGSTNumber" header="GST No." sortable />
//         <Column
//           field="supplierIsActive"
//           header="Active"
//           body={(row) =>
//             row.supplierIsActive === 'true' || row.supplierIsActive === true ? 'Yes' : 'No'
//           }
//           sortable
//         />
//         <Column header="Actions" body={actionBodyTemplate} />
//       </DataTable>

//       <Sidebar
//         visible={visibleRight}
//         position="right"
//         onHide={() => {
//           setVisibleRight(false)
//           setEditData(null)
//           setMode('add')
//         }}
//         style={{ width: '50vw' }}
//       >
//         <SettingsAddNewSupplier
//           mode={mode}
//           editData={editData}
//           onClose={() => {
//             setVisibleRight(false)
//             setEditData(null)
//             setMode('add')
//             fetchSuppliers()
//           }}
//           onSave={handleSave}
//           onUpdate={handleUpdate}
//         />
//       </Sidebar>
//     </div>
//   )
// }

// export default SettingsSuppliers

import React from 'react';

const SettingsSuppliers: React.FC = () => {
    return (
        <div>

        </div>
    );
};

export default SettingsSuppliers;
