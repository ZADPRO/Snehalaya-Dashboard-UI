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
        onClick={() => handleDelete(rowData.refCategoryId)}
      />
    </div>
  )

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.refCategoryId !== id))
    toast.current?.show({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Category deleted successfully',
      life: 2000
    })
  }

  const handleSave = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory])
  }

  const handleUpdate = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.refCategoryId === updatedCategory.refCategoryId ? updatedCategory : c))
    )
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
        <Column header="S.No" body={(_rowData, options) => options.rowIndex + 1} />
        <Column field="categoryName" header="Category Name" sortable />
        <Column field="categoryCode" header="Category Code" sortable />
        <Column header="Status" body={activeStatusBody} />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
        <Column header="Actions" body={actionBody} />
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
