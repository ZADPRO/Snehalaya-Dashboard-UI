import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Editor } from 'primereact/editor'
import { FloatLabel } from 'primereact/floatlabel'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'

interface Category {
  refCategoryId: number
  categoryName: string
}

interface SubCategory {
  refSubCategoryId: number
  subCategoryName: string
  refCategoryId: number
}

interface Attribute {
  name: string
  visible: boolean
  category?: any
  subCategory?: any
  description?: string
}

interface Props {
  isEdit: boolean
  attribute: Attribute
  categories: Category[]
  subCategories: SubCategory[]
  onSave: (data: Attribute) => void
  onCancel: () => void
}

const SettingsAddNewAttributes: React.FC<Props> = ({
  isEdit,
  attribute,
  categories,
  subCategories,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(attribute.name || '')
  const [visible, setVisible] = useState(attribute.visible || true)
  const [category, setCategory] = useState(attribute.category || null)
  const [subCategory, setSubCategory] = useState(attribute.subCategory || null)
  const [description, setDescription] = useState(attribute.description || '')

  const filteredSubCategories = category
    ? subCategories.filter((sc) => sc.refCategoryId === category.refCategoryId)
    : []

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      visible,
      category,
      subCategory,
      description
    })
  }
  return (
    <div>
      <div className="p-4">
        <h3>{isEdit ? 'Edit Attribute' : 'Add Attribute'}</h3>
        <div className="field mb-3 mt-3">
          <FloatLabel className="always-float">
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <label htmlFor="name">Attribute Name</label>
          </FloatLabel>
        </div>
        <div className="field mb-3">
          <FloatLabel className="always-float">
            <Dropdown
              id="category"
              value={category}
              options={categories}
              onChange={(e) => {
                setCategory(e.value)
                setSubCategory(null)
              }}
              optionLabel="categoryName"
              className="w-full"
            />
            <label htmlFor="category">Category</label>
          </FloatLabel>
        </div>
        <div className="field mb-3">
          <FloatLabel className="always-float">
            <Dropdown
              id="subCategory"
              value={subCategory}
              options={filteredSubCategories}
              onChange={(e) => setSubCategory(e.value)}
              optionLabel="subCategoryName"
              className="w-full"
              disabled={!category}
            />
            <label htmlFor="subCategory">Sub Category</label>
          </FloatLabel>
        </div>
        <div className="field mb-3">
          <FloatLabel className="always-float">
            <Editor
              id="description"
              value={description}
              onTextChange={(e) => setDescription(e.htmlValue || '')}
              style={{ height: '150px' }}
            />
            <label htmlFor="description">Description</label>
          </FloatLabel>
        </div>
        <div className="field flex gap-2 align-items-center">
          <p>Visible</p>
          <InputSwitch checked={visible} onChange={(e) => setVisible(e.value)} />
        </div>
        <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right gap-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text gap-2"
            onClick={onCancel}
          />
          <Button
            label="Save"
            icon="pi pi-check"
            className="p-button-success gap-2"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsAddNewAttributes
