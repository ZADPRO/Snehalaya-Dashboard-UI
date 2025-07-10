import { InputText } from 'primereact/inputtext'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

interface StatusOption {
  name: string
  isActive: boolean
}

interface BranchFormData {
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
  isMainBranch: boolean
  selectedStatus: StatusOption | null
}

export interface Branch {
  refBranchId: number
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
  isMainBranch: boolean
  isActive: boolean
  refBTId: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isDelete: boolean
}

interface SettingsAddNewBranchProps {
  mode: 'add' | 'edit'
  editData?: Branch | null
  onSave: (newBranch: Branch) => void
  onUpdate: (updatedBranch: Branch) => void
  onClose: () => void
}

const SettingsAddNewBranch: React.FC<SettingsAddNewBranchProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose
}) => {
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<BranchFormData>({
    refBranchName: '',
    refBranchCode: '',
    refLocation: '',
    refMobile: '',
    refEmail: '',
    isMainBranch: false,
    selectedStatus: { name: 'Active', isActive: true }
  })

  const statusOptions: StatusOption[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        refBranchName: editData.refBranchName,
        refBranchCode: editData.refBranchCode,
        refLocation: editData.refLocation,
        refMobile: editData.refMobile,
        refEmail: editData.refEmail,
        isMainBranch: editData.isMainBranch,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive
        }
      })
    }
  }, [mode, editData])

  const handleChange = (
    field: keyof BranchFormData,
    value: string | boolean | StatusOption | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any
    }))
  }

  const handleSubmit = () => {
    const branch: Branch = {
      refBranchId: editData?.refBranchId ?? Date.now(),
      refBranchName: formData.refBranchName.trim(),
      refBranchCode: formData.refBranchCode.trim(),
      refLocation: formData.refLocation.trim(),
      refMobile: formData.refMobile.trim(),
      refEmail: formData.refEmail.trim(),
      isMainBranch: formData.isMainBranch,
      isActive: formData.selectedStatus?.isActive ?? true,
      refBTId: 1, // Hardcoded for now; make dynamic if needed
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
      isDelete: false
    }

    if (mode === 'add') {
      onSave(branch)
      console.log('branch', branch)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Branch added successfully!',
        life: 3000
      })
    } else {
      onUpdate(branch)
      toast.current?.show({
        severity: 'success',
        summary: 'Updated',
        detail: 'Branch updated successfully!',
        life: 3000
      })
    }

    setTimeout(() => onClose(), 1000)
  }

  const isSaveDisabled =
    !formData.refBranchName.trim() ||
    !formData.refBranchCode.trim() ||
    !formData.refLocation.trim() ||
    !formData.refMobile.trim() ||
    !formData.refEmail.trim()

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast}   pt={{ icon: { className: 'mr-3' }  }} />

      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Branch' : 'Edit Branch'}
      </p>

      <div className="flex flex-column gap-4 mt-5">
        {/* Row 1 */}
        <div className="flex gap-4 align-items-center">
          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <InputText
                id="refBranchName"
                value={formData.refBranchName}
                className="w-full"
                onChange={(e) => handleChange('refBranchName', e.target.value)}
              />
              <label htmlFor="refBranchName">Branch Name</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <InputText
                id="refBranchCode"
                value={formData.refBranchCode}
                className="w-full"
                onChange={(e) => handleChange('refBranchCode', e.target.value)}
              />
              <label htmlFor="refBranchCode">Branch Code</label>
            </FloatLabel>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 align-items-center">
          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <InputText
                id="refLocation"
                value={formData.refLocation}
                className="w-full"
                onChange={(e) => handleChange('refLocation', e.target.value)}
              />
              <label htmlFor="refLocation">Location</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <InputText
                id="refMobile"
                value={formData.refMobile}
                className="w-full"
                onChange={(e) => handleChange('refMobile', e.target.value)}
              />
              <label htmlFor="refMobile">Mobile</label>
            </FloatLabel>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4 align-items-center">
          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <InputText
                id="refEmail"
                value={formData.refEmail}
                className="w-full"
                onChange={(e) => handleChange('refEmail', e.target.value)}
              />
              <label htmlFor="refEmail">Email</label>
            </FloatLabel>
          </div>

          <div className="flex-1 flex items-center gap-3">
            <label htmlFor="isMainBranch" className="min-w-[130px]">
              Is Main Branch
            </label>
            <InputSwitch
              id="isMainBranch"
              checked={formData.isMainBranch}
              onChange={(e) => handleChange('isMainBranch', e.value)}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex gap-4 align-items-center">
          <div className="flex-1">
            <FloatLabel className="flex-1 always-float">
              <Dropdown
                id="status"
                value={formData.selectedStatus}
                onChange={(e: DropdownChangeEvent) => handleChange('selectedStatus', e.value)}
                options={statusOptions}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="status">Status</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div> {/* Empty to align */}
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

export default SettingsAddNewBranch
