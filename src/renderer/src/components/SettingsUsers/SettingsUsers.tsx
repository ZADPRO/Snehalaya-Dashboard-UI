import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useRef, useState } from 'react'
import SettingsAddNewSidebar from './SettingsAddNewSidebar'

interface SubCategory {
  refSubCategoryId: number
  refCategoryId: number // <- use this name to match API
  subCategoryName: string
  subCategoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

const SettingsUsers: React.FC = () => {
  const dtRef = useRef<DataTable<SubCategory[]>>(null)
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

  const exportExcel = () => {
    dtRef.current?.exportCSV()
  }

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button
        icon="pi pi-plus"
        onClick={() => {
          // setMode('add')
          // setEditData(null)
          setVisibleRight(true)
        }}
      />
      {/* <Button icon="pi pi-refresh" severity="secondary" onClick={fetchSubCategories} /> */}
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
    <div>
      <div className="card">
        <Toast ref={toast} />

        <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

        <DataTable
          ref={dtRef}
          // value={subCategories}
          paginator
          rows={10}
          scrollable
          showGridlines
          globalFilter={globalFilter}
          rowsPerPageOptions={[10, 25, 50]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          emptyMessage="No sub-categories found."
          className="p-datatable-sm"
        >
          <Column header="S.No" body={(_, options) => options.rowIndex + 1} />
          <Column field="subCategoryName" header="Sub-Category" sortable />
          <Column field="subCategoryCode" header="Code" sortable />
          <Column field="createdAt" header="Created At" sortable />
          <Column field="createdBy" header="Created By" sortable />
        </DataTable>

        <Sidebar
          visible={visibleRight}
          position="right"
          onHide={() => {
            setVisibleRight(false)
            // setEditData(null)
            // setMode('add')
          }}
          style={{ width: '50vw' }}
        >
          <SettingsAddNewSidebar />
        </Sidebar>
      </div>
    </div>
  )
}

export default SettingsUsers
