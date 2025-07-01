import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

interface SubCategoryStatusOptions {
  name: string
  isActive: boolean
}

export interface SubCategory {
  refSubCategoryId: number
  parentCategoryId: number
  subCategoryName: string
  subCategoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

interface Category {
  refCategoryId: number
  categoryName: string
}

interface SubCategoryFormData {
  parentCategory: Category | null
  subCategoryName: string
  subCategoryCode: string
  selectedStatus: SubCategoryStatusOptions | null
}

interface Props {
  mode: 'add' | 'edit'
  editData?: SubCategory | null
  categories: Category[]
  onSave: (newSubCategory: SubCategory) => void
  onUpdate: (updatedSubCategory: SubCategory) => void
  onClose: () => void
}

const SettingsAddNewSubCategories: React.FC<Props> = ({
  mode,
  editData,
  categories,
  onSave,
  onUpdate,
  onClose
}) => {
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<SubCategoryFormData>({
    parentCategory: null,
    subCategoryName: '',
    subCategoryCode: '',
    selectedStatus: { name: 'Active', isActive: true }
  })

  const statusOptions: SubCategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  useEffect(() => {
    if (mode === 'edit' && editData) {
      const categoryMatch = categories.find((c) => c.refCategoryId === editData.parentCategoryId)
      setFormData({
        parentCategory: categoryMatch || null,
        subCategoryName: editData.subCategoryName,
        subCategoryCode: editData.subCategoryCode,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive
        }
      })
    }
  }, [mode, editData, categories])

  const handleInputChange = (
    field: keyof SubCategoryFormData,
    value: string | Category | SubCategoryStatusOptions | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const subCategory: SubCategory = {
      refSubCategoryId: editData?.refSubCategoryId ?? Date.now(),
      parentCategoryId: formData.parentCategory?.refCategoryId ?? 0,
      subCategoryName: formData.subCategoryName.trim(),
      subCategoryCode: formData.subCategoryCode.trim(),
      isActive: formData.selectedStatus?.isActive ?? true,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin'
    }

    if (mode === 'add') {
      onSave(subCategory)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Sub-category added successfully!',
        life: 3000
      })
    } else {
      onUpdate(subCategory)
      toast.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Sub-category updated successfully!',
        life: 3000
      })
    }

    setTimeout(() => onClose(), 1000)
  }

  const isDisabled =
    !formData.parentCategory || !formData.subCategoryName.trim() || !formData.subCategoryCode.trim()

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} />
      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Sub-Category' : 'Edit Sub-Category'}
      </p>

      <div className="flex flex-row gap-4">
        <div className="flex-1 gap-3">
          <FloatLabel>
            <Dropdown
              id="parentCategory"
              value={formData.parentCategory}
              onChange={(e) => handleInputChange('parentCategory', e.value)}
              options={categories}
              optionLabel="categoryName"
              placeholder="Select Category"
              className="w-full"
            />
            <label htmlFor="parentCategory">Parent Category</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel>
            <InputText
              id="subCategoryName"
              value={formData.subCategoryName}
              className="w-full"
              onChange={(e) => handleInputChange('subCategoryName', e.target.value)}
            />
            <label htmlFor="subCategoryName">Sub-Category Name</label>
          </FloatLabel>
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <div className="flex-1">
          <FloatLabel>
            <InputText
              id="subCategoryCode"
              value={formData.subCategoryCode}
              className="w-full"
              onChange={(e) => handleInputChange('subCategoryCode', e.target.value)}
            />
            <label htmlFor="subCategoryCode">Sub-Category Code</label>
          </FloatLabel>
        </div>

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
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          disabled={isDisabled}
        />
      </div>
    </div>
  )
}

export default SettingsAddNewSubCategories
