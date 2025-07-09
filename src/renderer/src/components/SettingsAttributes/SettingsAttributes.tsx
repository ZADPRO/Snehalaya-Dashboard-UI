import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { Toolbar } from 'primereact/toolbar'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import { Sidebar } from 'primereact/sidebar'
import SettingsAddNewAttributes from './SettingsAddNewAttributes'

interface Attribute {
  name: string
  visible: boolean
  category?: any
  subCategory?: any
  description?: string
}

interface Category {
  refCategoryId: number
  categoryName: string
}

interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
}

const SettingsAttributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [sidebarVisible, setSidebarVisible] = useState(false)

  // Fields
  const [attributeName, setAttributeName] = useState('')
  const [visible, setVisible] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [description, setDescription] = useState('')

  // Master Lists
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [editIndex, setEditIndex] = useState<number | null>(null)

  const toast = useRef<Toast>(null)

  // Fetch categories and subcategories on mount
  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.getItem('token') || ''
    }

    axios
      .get('http://localhost:8080/api/v1/admin/settings/categories', { headers })
      .then((res) => {
        setCategories(res.data.data)
      })
      .catch((err) => console.error('Failed to fetch categories', err))

    axios
      .get('http://localhost:8080/api/v1/admin/settings/subcategories', { headers })
      .then((res) => {
        setSubCategories(res.data.data)
      })
      .catch((err) => console.error('Failed to fetch subcategories', err))
  }, [])

  const openNewSidebar = () => {
    setAttributeName('')
    setVisible(true)
    setCategory(null)
    setSubCategory(null)
    setDescription('')
    setEditIndex(null)
    setSidebarVisible(true)
  }

  const editAttribute = (rowData: Attribute, index: number) => {
    setAttributeName(rowData.name)
    setVisible(rowData.visible)
    setCategory(rowData.category || null)
    setSubCategory(rowData.subCategory || null)
    setDescription(rowData.description || '')
    setEditIndex(index)
    setSidebarVisible(true)
  }

  const deleteAttribute = (index: number) => {
    const updated = [...attributes]
    updated.splice(index, 1)
    setAttributes(updated)
    toast.current?.show({
      severity: 'warn',
      summary: 'Deleted',
      detail: 'Attribute removed',
      life: 5000
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
      className="p-button-success gap-2"
      onClick={openNewSidebar}
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
        <Column field="category.categoryName" header="Category" />
        <Column field="subCategory.subCategoryName" header="Sub Category" />
        <Column header="Visible" body={visibleTemplate} />
        <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem' }} />
      </DataTable>

      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewAttributes
          isEdit={editIndex !== null}
          attribute={{
            name: attributeName,
            visible,
            category,
            subCategory,
            description
          }}
          categories={categories}
          subCategories={subCategories}
          onSave={(data) => {
            const updatedList = [...attributes]
            if (editIndex !== null) {
              updatedList[editIndex] = data
              toast.current?.show({
                severity: 'success',
                summary: 'Updated',
                detail: 'Attribute updated'
              })
            } else {
              updatedList.push(data)
              toast.current?.show({
                severity: 'success',
                summary: 'Added',
                detail: 'Attribute added'
              })
            }
            setAttributes(updatedList)
            setSidebarVisible(false)
          }}
          onCancel={() => setSidebarVisible(false)}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsAttributes
