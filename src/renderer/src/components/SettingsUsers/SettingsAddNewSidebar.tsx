import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputSwitch } from 'primereact/inputswitch'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

interface ModulePermission {
  id: number
  moduleName: string
  visible: boolean
  canView: boolean
  canEdit: boolean
}

interface RoleOption {
  label: string
  value: string
}

const roleOptions: RoleOption[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Accounts Manager', value: 'accountsManager' },
  { label: 'Store Manager', value: 'storeManager' },
  { label: 'Purchase Manager', value: 'purchaseManager' },
  { label: 'Billing Executive', value: 'billingExecutive' },
  { label: 'Sales Executive', value: 'salesExecutive' },
  { label: 'SEO', value: 'seo' },
  { label: 'Customer Support', value: 'customerSupport' },
  { label: 'Supplier', value: 'supplier' }
]

const SettingsAddNewSidebar: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const [permissions, setPermissions] = useState<ModulePermission[]>([
    { id: 1, moduleName: 'Dashboard', visible: true, canView: true, canEdit: false },
    { id: 2, moduleName: 'Inventory', visible: true, canView: false, canEdit: false },
    { id: 3, moduleName: 'Products (PO)', visible: false, canView: false, canEdit: false },
    { id: 4, moduleName: 'Sales Order', visible: true, canView: true, canEdit: true }
  ])

  const handleCheckboxChange = (id: number, field: keyof ModulePermission, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((module) => (module.id === id ? { ...module, [field]: checked } : module))
    )
  }

  const handleVisibilityToggle = (id: number, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((module) => (module.id === id ? { ...module, visible: checked } : module))
    )
  }

  const renderVisibility = (rowData: ModulePermission) => (
    <InputSwitch
      checked={rowData.visible}
      onChange={(e) => handleVisibilityToggle(rowData.id, e.value)}
    />
  )

  const renderCheckbox = (rowData: ModulePermission, field: keyof ModulePermission) => (
    <Checkbox
      inputId={`${field}-${rowData.id}`}
      checked={rowData[field] as boolean}
      onChange={(e) => handleCheckboxChange(rowData.id, field, e.checked!)}
    />
  )

  const handleSave = () => {
    console.log('Selected Role:', selectedRole)
    console.log('Permissions:', permissions)

    // Save logic here...
  }

  return (
    <div className="p-4 flex flex-column gap-4">
      {/* Role Dropdown */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Dropdown
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.value)}
            options={roleOptions}
            optionLabel="label"
            placeholder="Select Role"
            className="w-full"
          />
        </div>
        <div className="flex-1"></div>
      </div>

      {/* Permission Table */}
      <DataTable value={permissions} className="p-datatable-sm" showGridlines>
        <Column
          header="S.No"
          body={(_, options) => options.rowIndex + 1}
          style={{ width: '60px' }}
        />
        <Column field="moduleName" header="Module Name" />
        <Column header="Visibility" body={renderVisibility} style={{ textAlign: 'center' }} />
        <Column
          header="View Only"
          body={(rowData) => renderCheckbox(rowData, 'canView')}
          style={{ textAlign: 'center' }}
        />
        <Column
          header="Edit"
          body={(rowData) => renderCheckbox(rowData, 'canEdit')}
          style={{ textAlign: 'center' }}
        />
      </DataTable>

      {/* Save Button */}
      <div className="text-right mt-4">
        <Button
          label="Save"
          icon="pi pi-check"
          className="gap-2"
          onClick={handleSave}
          disabled={!selectedRole}
        />
      </div>
    </div>
  )
}

export default SettingsAddNewSidebar
