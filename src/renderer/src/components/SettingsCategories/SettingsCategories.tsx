import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'

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

  const dtRef = React.useRef<DataTable<Category[]>>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const response = {
      data: [
        {
          refCategoryId: 0,
          categoryName: 'Category 001',
          categoryCode: 'C001',
          isActive: true,
          createdAt: '2025-06-23 15:50:56',
          createdBy: 'Admin',
          updatedAt: '',
          updatedBy: ''
        },
        {
          refCategoryId: 1,
          categoryName: 'Category 002',
          categoryCode: 'C002',
          isActive: false,
          createdAt: '2025-06-23 15:53:12',
          createdBy: 'Admin',
          updatedAt: '',
          updatedBy: ''
        }
      ],
      status: true
    }

    if (response.status) {
      setCategories(response.data)
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
      <Button label="" icon="pi pi-plus" />
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

  return (
    <div className="card">
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
      </DataTable>
    </div>
  )
}

export default SettingsCategories
