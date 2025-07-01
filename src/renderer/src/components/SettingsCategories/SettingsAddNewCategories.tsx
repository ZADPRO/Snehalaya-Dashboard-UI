import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import React, { useState } from 'react'

interface CategoryStatusOptions {
  name: string
  isActive: boolean
}

interface CategoryFormData {
  categoryName: string
  categoryCode: string
  selectedStatus: CategoryStatusOptions | null
}

const SettingsAddNewCategories: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryCode: '',
    selectedStatus: null
  })

  const statusOptions: CategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | CategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleSave = () => {
    console.log('Form data:', formData)
    // Add your save logic here (e.g., API call)
  }

  return (
    <div className="p-4">
      <p className="text-xl font-semibold">Add New Categories</p>

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

      <div className="flex mt-4 gap-3">
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

        <div className="flex-1"></div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label="Save"
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}

export default SettingsAddNewCategories
