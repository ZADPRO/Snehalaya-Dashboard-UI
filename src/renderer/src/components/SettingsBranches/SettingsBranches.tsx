import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Sidebar } from 'primereact/sidebar'
import SettingsAddNewBranch from './SettingsAddNewBranch'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import { InputSwitch } from 'primereact/inputswitch'

export interface Branch {
  refBranchId: number
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
  isMainBranch: boolean
  isActive: boolean
  isDelete: boolean
  refBTId: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

const SettingsBranches: React.FC = () => {
  const [categories, setCategories] = useState<Branch[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [visibleRight, setVisibleRight] = useState(false)

  const dtRef = React.useRef<DataTable<Branch[]>>(null)

  const [editData, setEditData] = useState<Branch | null>(null)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const toast = useRef<Toast>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token')
        }
      })
      console.log('response', response)
      if (response.status) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const exportExcel = () => {
    dtRef.current?.exportCSV()
  }

  const activeStatusBody = (rowData: Branch) => (
    <Tag
      value={rowData.isActive ? 'Active' : 'Inactive'}
      severity={rowData.isActive ? 'success' : 'danger'}
    />
  )

  const branchStatusBody = (rowData: Branch) => (
    <InputSwitch
      checked={rowData.isMainBranch}
      // onChange={(e) => handleMainBranchToggle(rowData, e.value)}
    />
  )

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button label="" icon="pi pi-plus" onClick={() => setVisibleRight(true)} />
      <Button label="" icon="pi pi-refresh" severity="secondary" onClick={fetchData} />
    </div>
  )

  const rightHeader = (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        placeholder="Search"
        className="w-25rem"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </IconField>
    
  )

  const actionBody = (rowData: Branch) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setEditData(rowData)
          setMode('edit')
          setVisibleRight(true)
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData.refBranchId)}
      />
    </div>
  )

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/settings/branches/${id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      const data = response.data

      if (data.confirmationNeeded) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Confirmation Needed',
          detail: `${data.message}. Contains ${data.subcategories.length} subcategories.`,
          life: 5000
        })
      } else if (data.status) {
        fetchData()
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Category deleted successfully',
          life: 2000
        })
      }
    } catch (error) {
      console.error(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete category',
        life: 2000
      })
    }
  }

  const handleSave = async (newCategory: Branch) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/settings/branches`,
        {
          refBranchName: newCategory.refBranchName.trim(),
          refBranchCode: newCategory.refBranchCode.trim(),
          refLocation: newCategory.refLocation.trim(),
          refMobile: newCategory.refMobile.trim(),
          refEmail: newCategory.refEmail.trim(),
          isMainBranch: newCategory.isMainBranch,
          isActive: newCategory?.isActive ?? true,
          refBTId: 1, // Hardcoded for now; make dynamic if needed
          createdAt: newCategory?.createdAt ?? new Date().toISOString(),
          createdBy: 'Admin',
          updatedAt: new Date().toISOString(),
          updatedBy: 'Admin',
          isDelete: false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      if (response.data?.status) {
        fetchData()
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Category created successfully',
          life: 2000
        })
      }
    } catch (error) {
      console.log(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create category',
        life: 2000
      })
    }
  }

  const handleUpdate = async (updatedCategory: Branch) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/settings/branches`,
        {
          refBranchId: updatedCategory.refBranchId,
          refBranchName: updatedCategory.refBranchName,
          refBranchCode: updatedCategory.refBranchCode,
          refLocation: updatedCategory.refLocation,
          refMobile: updatedCategory.refMobile,
          refEmail: updatedCategory.refEmail,
          isMainBranch: updatedCategory.isMainBranch,
          isActive: updatedCategory.isActive,
          refBTId: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      if (response.data?.status) {
        fetchData()
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Category updated successfully',
          life: 2000
        })
      }
    } catch (error) {
      console.log(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update category',
        life: 2000
      })
    }
  }

  return (
    <div className="card">
      <Toast ref={toast} />

      <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

      <DataTable
        ref={dtRef}
        value={categories}
        paginator
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        showGridlines
        scrollable
        sortMode="multiple"
        globalFilter={globalFilter}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        emptyMessage="No categories found."
        className="p-datatable-sm"
      >
        <Column
          header="S.No"
          body={(_rowData, options) => options.rowIndex + 1}
          style={{ minWidth: '1rem' }}
        />
        <Column field="refBranchName" header="Branch Name" sortable style={{ minWidth: '5rem' }} />
        <Column field="refBranchCode" header="Branch Code" sortable style={{ minWidth: '5rem' }} />
        <Column field="refLocation" header="Location" sortable style={{ minWidth: '5rem' }} />
        <Column field="refMobile" header="Mobile" sortable style={{ minWidth: '5rem' }} />
        <Column header="Main Branch" body={branchStatusBody} style={{ minWidth: '5rem' }} />

        <Column header="Status" body={activeStatusBody} style={{ minWidth: '5rem' }} />
        <Column field="createdAt" header="Created At" sortable style={{ minWidth: '5rem' }} />
        <Column field="createdBy" header="Created By" sortable style={{ minWidth: '5rem' }} />
        <Column header="Actions" body={actionBody} style={{ minWidth: '5rem' }} />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => {
          setVisibleRight(false)
          setEditData(null)
          setMode('add')
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewBranch
          mode={mode}
          editData={editData}
          onClose={() => setVisibleRight(false)}
          onSave={handleSave}
          onUpdate={handleUpdate}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsBranches
