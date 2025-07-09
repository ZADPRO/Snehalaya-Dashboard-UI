import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'

interface Attribute {
  name: string
  visible: boolean
}

const SettingsAttributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributeName, setAttributeName] = useState('')
  const [visible, setVisible] = useState(true)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const toast = React.useRef<Toast>(null)

  const openNewDialog = () => {
    setAttributeName('')
    setVisible(true)
    setEditIndex(null)
    setDialogVisible(true)
  }

  const saveAttribute = () => {
    if (!attributeName.trim()) return

    const updatedList = [...attributes]
    if (editIndex !== null) {
      updatedList[editIndex] = { name: attributeName.trim(), visible }
      toast.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Attribute updated successfully'
      })
    } else {
      updatedList.push({ name: attributeName.trim(), visible })
      toast.current?.show({
        severity: 'success',
        summary: 'Added',
        detail: 'Attribute added successfully',
        life: 10000
      })
    }

    setAttributes(updatedList)
    setDialogVisible(false)
  }

  const editAttribute = (rowData: Attribute, index: number) => {
    setAttributeName(rowData.name)
    setVisible(rowData.visible)
    setEditIndex(index)
    setDialogVisible(true)
  }

  const deleteAttribute = (index: number) => {
    const updated = [...attributes]
    updated.splice(index, 1)
    setAttributes(updated)
    toast.current?.show({
      severity: 'warn',
      summary: 'Deleted',
      detail: 'Attribute removed',
      life: 10000
    })
  }

  const toggleVisibility = (value: boolean, index: number) => {
    const updated = [...attributes]
    updated[index].visible = value
    setAttributes(updated)
  }

  const actionBodyTemplate = (rowData: Attribute, options: any) => (
    <>
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm"
        onClick={() => editAttribute(rowData, options.rowIndex)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-danger p-button-sm ml-2"
        onClick={() => deleteAttribute(options.rowIndex)}
      />
    </>
  )

  const visibleTemplate = (rowData: Attribute, options: any) => (
    <InputSwitch
      checked={rowData.visible}
      onChange={(e) => toggleVisibility(e.value, options.rowIndex)}
    />
  )

  const leftToolbarTemplate = () => (
    <Button
      label="Add Attribute"
      icon="pi pi-plus"
      className="p-button-success"
      onClick={openNewDialog}
    />
  )

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="mb-4">Product Attribute Settings</h2>

      <Toolbar className="mb-3" left={leftToolbarTemplate} />

      <DataTable
        value={attributes}
        responsiveLayout="scroll"
        emptyMessage="No attributes found."
        showGridlines
      >
        <Column field="name" header="Attribute Name" />
        <Column header="Visible" body={visibleTemplate} />
        <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem' }} />
      </DataTable>

      <Dialog
        header={editIndex !== null ? 'Edit Attribute' : 'New Attribute'}
        visible={dialogVisible}
        style={{ width: '30vw' }}
        modal
        onHide={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-content-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setDialogVisible(false)}
              className="p-button-text gap-2"
            />
            <Button
              className="gap-2"
              label="Save"
              icon="pi pi-check"
              onClick={saveAttribute}
              autoFocus
            />
          </div>
        }
      >
        <div className="field mb-3 mt-3">
          <FloatLabel className="flex-1 always-float">
            <InputText
              id="attrName"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              className="w-full"
            />

            <label htmlFor="attrName">Attribute Name</label>
          </FloatLabel>
        </div>

        <div className="flex gap-2 align-items-center">
          <p>Visible</p>
          <InputSwitch id="visible" checked={visible} onChange={(e) => setVisible(e.value)} />
        </div>
      </Dialog>
    </div>
  )
}

export default SettingsAttributes
