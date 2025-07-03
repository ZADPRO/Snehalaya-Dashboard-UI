import React, { useRef, useState } from 'react'
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEvent,
  DataTableValueArray
} from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputSwitch } from 'primereact/inputswitch'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

interface SubModulePermission {
  name: string
  canView: boolean
  canEdit?: boolean
}

interface ModulePermission {
  id: number
  moduleName: string
  visible: boolean
  canView: boolean
  canEdit: boolean
  subModules?: SubModulePermission[]
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

  const toast = useRef<Toast>(null)

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)

  const [permissions, setPermissions] = useState<ModulePermission[]>([
    {
      id: 1,
      moduleName: 'Dashboard',
      visible: true,
      canView: true,
      canEdit: false,
      subModules: [
        { name: 'Total Sales', canView: true },
        { name: 'Total Orders', canView: true },
        { name: 'Revenue', canView: true },
        { name: 'New Customer', canView: true },
        { name: 'Repeat Customer', canView: true },
        { name: 'Pending Orders', canView: false }
      ]
    },
    {
      id: 2,
      moduleName: 'Inventory',
      visible: true,
      canView: true,
      canEdit: true,
      subModules: [
        { name: 'View', canView: true, canEdit: false },
        { name: 'Modify', canView: true, canEdit: true }
      ]
    },
    {
      id: 3,
      moduleName: 'Purchase Order',
      visible: true,
      canView: true,
      canEdit: true,
      subModules: [
        { name: 'Overview', canView: true, canEdit: true },
        { name: 'Purchase Order', canView: true, canEdit: false },
        { name: 'Create Purchase', canView: false, canEdit: false },
        { name: 'Products', canView: true, canEdit: true },
        { name: 'Create Products', canView: false, canEdit: true }
      ]
    },
    {
      id: 4,
      moduleName: 'Sales Order',
      visible: true,
      canView: true,
      canEdit: true
    },
    {
      id: 5,
      moduleName: 'Settings',
      visible: true,
      canView: true,
      canEdit: true,
      subModules: [
        { name: 'Overview', canView: true, canEdit: false },
        { name: 'Categories', canView: true, canEdit: true },
        { name: 'Sub Categories', canView: true, canEdit: true },
        { name: 'Branches', canView: true, canEdit: true },
        { name: 'Suppliers', canView: true, canEdit: false },
        { name: 'User Roles', canView: true, canEdit: true },
        { name: 'Attributes', canView: false, canEdit: false },
        { name: 'Employees', canView: true, canEdit: true },
        { name: 'Bank', canView: true, canEdit: true }
      ]
    },
    {
      id: 6,
      moduleName: 'Profile',
      visible: true,
      canView: true,
      canEdit: true
    }
  ])

  const handleCheckboxChange = (id: number, field: keyof ModulePermission, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((module) => {
        if (module.id === id) {
          const updatedModule = { ...module, [field]: checked }
          // If "Edit" is being checked, force "View" to true
          if (field === 'canEdit' && checked) {
            updatedModule.canView = true
          }
          // If "View" is being unchecked and "Edit" is true, disable "Edit"
          if (field === 'canView' && !checked && module.canEdit) {
            updatedModule.canEdit = false
          }

          return updatedModule
        }
        return module
      })
    )
  }

  const handleVisibilityToggle = (id: number, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((module) =>
        module.id === id
          ? {
              ...module,
              visible: checked,
              // Reset view/edit to false if turning off visibility
              canView: checked ? module.canView : false,
              canEdit: checked ? module.canEdit : false
            }
          : module
      )
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
      disabled={!rowData.visible}
    />
  )

  const handleSave = () => {
    console.log('Selected Role:', selectedRole)
    console.log('Permissions:', permissions)
    // Save logic here...
  }

  const allowExpansion = (rowData: ModulePermission) => {
    return Array.isArray(rowData.subModules) && rowData.subModules.length > 0
  }

  const onRowCollapse = (event: DataTableRowEvent) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000
    })
  }

  const onRowExpand = (event: DataTableRowEvent) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Product Expanded',
      detail: event.data.name,
      life: 3000
    })
  }

  const rowExpansionTemplate = (data: ModulePermission) => {
    return (
      <div className="p-3">
        <DataTable value={data.subModules}>
          <Column field="name" header="Sub Module" />
          <Column field="canView" header="Can View" body={(row) => (row.canView ? 'Yes' : 'No')} />
          <Column
            field="canEdit"
            header="Can Edit"
            body={(row) => (row.canEdit !== undefined ? (row.canEdit ? 'Yes' : 'No') : '-')}
          />
        </DataTable>
      </div>
    )
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
      <DataTable
        value={permissions}
        className="p-datatable-sm"
        showGridlines
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander={allowExpansion} style={{ width: '3rem' }} />
        <Column
          header="S.No"
          body={(_, options) => options.rowIndex + 1}
          style={{ width: '3rem' }}
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
