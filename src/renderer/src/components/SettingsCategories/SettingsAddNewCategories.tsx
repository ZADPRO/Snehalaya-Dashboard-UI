import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

interface CategoryStatusOptions {
  name: string
  isActive: boolean
}

export interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  profitMargin?: number
  profitMargin?: number
}

interface CategoryFormData {
  categoryName: string
  categoryCode: string
  selectedStatus: CategoryStatusOptions | null
  profitMargin: string
  profitMargin: string
}

interface SettingsAddNewCategoriesProps {
  mode: 'add' | 'edit'
  editData?: Category | null
  onSave: (newCategory: Category) => void
  onUpdate: (updatedCategory: Category) => void
  onClose: () => void
}

const SettingsAddNewCategories: React.FC<SettingsAddNewCategoriesProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose
}) => {
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryCode: '',
    selectedStatus: { name: 'Active', isActive: true },
    profitMargin: ''
    selectedStatus: { name: 'Active', isActive: true },
    profitMargin: ''
  })

  const statusOptions: CategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        categoryName: editData.categoryName,
        categoryCode: editData.categoryCode,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive
        },
        profitMargin: editData.profitMargin?.toString() || ''
        },
        profitMargin: editData.profitMargin?.toString() || ''
      })
    }
  }, [mode, editData])

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | CategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    const category: Category = {
      refCategoryId: editData?.refCategoryId ?? Date.now(),
      categoryName: formData.categoryName.trim(),
      categoryCode: formData.categoryCode.trim(),
      isActive: formData.selectedStatus?.isActive ?? true,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
      profitMargin: parseFloat(formData.profitMargin) || 0
      updatedBy: 'Admin',
      profitMargin: parseFloat(formData.profitMargin) || 0
    }

    if (mode === 'add') {
      onSave(category)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Category added successfully!',
        life: 3000
      })
    } else {
      onUpdate(category)
      toast.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Category updated successfully!',
        life: 3000
      })
    }

    setTimeout(() => onClose(), 1000)
  }

  const isSaveDisabled = !formData.categoryName.trim() || !formData.categoryCode.trim()  ||
    formData.profitMargin === '' ||
    isNaN(Number(formData.profitMargin))

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} />

      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Category' : 'Edit Category'}
      </p>

      <div className="flex mt-5 gap-3">
        <div className="flex-1">
          <FloatLabel>
            <InputText
              id="categoryName"
              value={formData.categoryName}
              className="w-full"
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
            />
            <label htmlFor="categoryName">Category Name</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel>
            <InputText
              id="categoryCode"
              value={formData.categoryCode}
              className="w-full"
              onChange={(e) => handleInputChange('categoryCode', e.target.value)}
            />
            <label htmlFor="categoryCode">Category Code</label>
          </FloatLabel>
        </div>
      </div>
<div className="flex mt-5 gap-3">
 
  <div className="flex-1">
    <FloatLabel>
      <Dropdown
        id="status"
        value={formData.selectedStatus}
        onChange={(e: DropdownChangeEvent) => handleInputChange('selectedStatus', e.value)}
        options={statusOptions}
        optionLabel="name"
        className="w-full"
      />
      <label htmlFor="status">Status</label>
    </FloatLabel>
  </div>

  <div className="flex-1">
    <FloatLabel>
      <InputText
        id="profitMargin"
        keyfilter="num"
        value={formData.profitMargin}
        className="w-full"
        onChange={(e) => handleInputChange('profitMargin', e.target.value)}
      />
      <label htmlFor="profitMargin">Profit Margin (%)</label>
    </FloatLabel>
  </div>
</div>


      

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          disabled={isSaveDisabled}
        />
      </div>
    </div>
  )
}

export default SettingsAddNewCategories
