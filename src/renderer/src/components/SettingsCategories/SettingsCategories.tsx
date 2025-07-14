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
import SettingsAddNewCategories from './SettingsAddNewCategories'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

const SettingsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [visibleRight, setVisibleRight] = useState(false)

  const dtRef = React.useRef<DataTable<Category[]>>(null)

  const [editData, setEditData] = useState<Category | null>(null)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const toast = useRef<Toast>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )
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

  const activeStatusBody = (rowData: Category) => (
    <Tag
      value={rowData.isActive ? 'Active' : 'Inactive'}
      severity={rowData.isActive ? 'success' : 'danger'}
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

  const actionBody = (rowData: Category) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        text
        onClick={() => {
          setEditData(rowData)
          setMode('edit')
          setVisibleRight(true)
        }}
      />
      <Button
        icon="pi pi-trash"
        text
        severity="danger"
        onClick={() => handleDelete(rowData.refCategoryId)}
      />
    </div>
  )

  const handleDelete = async (id: number, forceDelete: boolean = false) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/admin/settings/categories/${id}`,
      {
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
        params: forceDelete ? { force: true } : {}
      }
    )

    const data = response.data

    if (data.confirmationNeeded) {
      confirmDialog({
        message: data.message || 'This category contains subcategories. Are you sure you want to delete it?',
        header: 'Confirmation Required',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        accept: () => handleDelete(id, true),  // <-- Retry with forceDelete
        reject: () => {
          toast.current?.show({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Category deletion cancelled.',
            life: 2000
          })
        }
      })
    } else if (data.status) {
      fetchData()
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: data.message || 'Category deleted successfully',
        life: 2000
      })
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: data.message || 'Failed to delete category',
        life: 3000
      })
    }
  } catch (error: any) {
    console.error(error)
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail:
        error?.response?.data?.message ||
        'An unexpected error occurred while deleting the category.',
      life: 3000
    })
  }
}

  const handleSave = async (newCategory: Category) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          categoryName: newCategory.categoryName,
          categoryCode: newCategory.categoryCode,
          isActive: newCategory.isActive
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (updatedCategory: Category) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          refCategoryId: updatedCategory.refCategoryId,
          categoryName: updatedCategory.categoryName,
          categoryCode: updatedCategory.categoryCode,
          isActive: updatedCategory.isActive
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="card">
      <Toast ref={toast} />
       <ConfirmDialog />
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
        <Column field="categoryName" header="Category Name" sortable style={{ minWidth: '5rem' }} />
        <Column field="categoryCode" header="Category Code" sortable style={{ minWidth: '5rem' }} />
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
        <SettingsAddNewCategories
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

export default SettingsCategories
