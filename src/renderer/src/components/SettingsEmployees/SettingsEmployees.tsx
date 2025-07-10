import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import SettingsAddEmployees from './SettingsAddEmployees'

interface UserRole {
  id: number
  userName: string
  email: string
  role: string
  createdAt: string
  createdBy: string
}

const SettingsEmployees: React.FC = () => {
  const dtRef = useRef<DataTable<UserRole[]>>(null)
  const toast = useRef<Toast>(null)
  const [visibleRight, setVisibleRight] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

  const [users, setUsers] = useState<UserRole[]>([])

  const exportExcel = () => {
    dtRef.current?.exportCSV()
  }

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button
        icon="pi pi-plus"
        onClick={() => {
          setVisibleRight(true)
        }}
      />
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

  useEffect(() => {
    const data = [
      {
        id: 1,
        userName: 'Thiru Kumara',
        email: 'thiru@example.com',
        role: 'Admin',
        createdAt: '2024-07-01 10:00',
        createdBy: 'System'
      },
      {
        id: 2,
        userName: 'Arun Prasad',
        email: 'arun@example.com',
        role: 'Store Manager',
        createdAt: '2024-07-03 15:22',
        createdBy: 'Admin'
      }
    ]

    setUsers(data)
  }, [])

  return (
    <div>
      <div className="card">
        <Toast ref={toast} />

        <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

        <DataTable
          ref={dtRef}
          value={users}
          paginator
          rows={10}
          scrollable
          showGridlines
          globalFilter={globalFilter}
          rowsPerPageOptions={[10, 25, 50]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          emptyMessage="No users found."
          className="p-datatable-sm"
        >
          <Column header="S.No" body={(_, options) => options.rowIndex + 1} />
          <Column field="userName" header="User Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Role" sortable />
          <Column field="createdAt" header="Created At" sortable />
          <Column field="createdBy" header="Created By" sortable />
          <Column
            header="Actions"
            body={(_rowData) => (
              <Button
                icon="pi pi-pencil"
                text
                onClick={() => {
                  setVisibleRight(true)
                }}
              />
            )}
            style={{ width: '100px', textAlign: 'center' }}
          />
        </DataTable>

        <Sidebar
          visible={visibleRight}
          position="right"
          onHide={() => {
            setVisibleRight(false)
          }}
          style={{ width: '50vw' }}
        >
          <SettingsAddEmployees />
        </Sidebar>
      </div>
    </div>
  )
}

export default SettingsEmployees
