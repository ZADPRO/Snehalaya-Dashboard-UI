import React, { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'

interface StatusOption {
  name: string
  value: boolean
}

export interface Supplier {
  supplierId: number
  supplierName?: string
  supplierCompanyName?: string
  supplierCode?: string
  supplierEmail?: string
  supplierGSTNumber?: string
  supplierPaymentTerms?: string
  supplierBankACNumber?: string
  supplierIFSC?: string
  supplierBankName?: string
  supplierUPI?: string
  supplierIsActive?: string | boolean
  supplierContactNumber?: string
  emergencyContactName?: string
  emergencyContactNumber?: string
  supplierDoorNumber?: string
  supplierStreet?: string
  supplierCity?: string
  supplierState?: string
  supplierCountry?: string
  isDelete?: boolean
}

interface Props {
  mode: 'add' | 'edit'
  editData?: Supplier | null
  onClose: () => void
  onSave?: (supplier: Supplier) => Promise<void>
  onUpdate?: (supplier: Supplier) => Promise<void>
}

const SettingsAddNewSupplier: React.FC<Props> = ({ mode, editData, onClose, onSave, onUpdate }) => {
  const toast = useRef<Toast>(null)

  const [formData, setFormData] = useState<Supplier>({
    supplierId: 0,
    supplierName: '',
    supplierCompanyName: '',
    supplierCode: '',
    supplierEmail: '',
    supplierGSTNumber: '',
    supplierPaymentTerms: '',
    supplierBankACNumber: '',
    supplierIFSC: '',
    supplierBankName: '',
    supplierUPI: '',
    supplierIsActive: 'true',
    supplierContactNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    supplierDoorNumber: '',
    supplierStreet: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    isDelete: false
  })

  const statusOptions: StatusOption[] = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false }
  ]

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({ ...editData })
    }
  }, [mode, editData])

  const handleChange = (field: keyof Supplier, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
  }

  const showToast = (detail: string) => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Error',
      detail,
      life: 3000
    })
  }

  const validateForm = () => {
    const requiredFields = [
      { field: 'supplierName', label: 'Supplier Name' },
      { field: 'supplierCompanyName', label: 'Company Name' },
      { field: 'supplierCode', label: 'Supplier Code' },
      { field: 'supplierEmail', label: 'Email' },
      { field: 'supplierContactNumber', label: 'Contact Number' },
      { field: 'supplierDoorNumber', label: 'Door Number' },
      { field: 'supplierStreet', label: 'Street' },
      { field: 'supplierCity', label: 'City' },
      { field: 'supplierState', label: 'State' },
      { field: 'supplierCountry', label: 'Country' },
      { field: 'supplierBankName', label: 'Bank Name' },
      { field: 'supplierBankACNumber', label: 'Account Number' },
      { field: 'supplierIFSC', label: 'IFSC' },
      { field: 'supplierGSTNumber', label: 'GST Number' },
      { field: 'supplierUPI', label: 'UPI' },
      { field: 'supplierPaymentTerms', label: 'Payment Terms' },
      { field: 'emergencyContactName', label: 'Emergency Contact Name' },
      { field: 'emergencyContactNumber', label: 'Emergency Contact Number' }
    ]

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof Supplier]?.toString().trim()) {
        showToast(`${label} is required`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobileRegex = /^[6-9]\d{9}$/
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/
    const accountNumberRegex = /^\d{9,18}$/

    if (!emailRegex.test(formData.supplierEmail || '')) {
      showToast('Invalid email format')
      return false
    }

    if (!mobileRegex.test(formData.supplierContactNumber || '')) {
      showToast('Invalid mobile number (10 digits starting with 6-9)')
      return false
    }

    if (!mobileRegex.test(formData.emergencyContactNumber || '')) {
      showToast('Invalid emergency contact number')
      return false
    }

    if (!accountNumberRegex.test(formData.supplierBankACNumber || '')) {
      showToast('Invalid bank account number')
      return false
    }

    if (!ifscRegex.test(formData.supplierIFSC || '')) {
      showToast('Invalid IFSC code format ( contain 4 Alphabets & 6 numbers )')
      return false
    }

    if (!upiRegex.test(formData.supplierUPI || '')) {
      showToast('Invalid UPI ID format (example@bank)')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const supplierPayload: Supplier = {
      ...formData,
      supplierIsActive:
        formData.supplierIsActive === true || formData.supplierIsActive === 'true'
          ? 'true'
          : 'false',
      isDelete: false,
      supplierId: editData?.supplierId ?? 0
    }

    try {
      if (mode === 'add' && onSave) {
        await onSave(supplierPayload)
      } else if (mode === 'edit' && onUpdate) {
        await onUpdate(supplierPayload)
      }

      toast.current?.show({
        severity: 'success',
        summary: mode === 'add' ? 'Saved' : 'Updated',
        detail: `Supplier ${mode === 'add' ? 'created' : 'updated'} successfully`,
        life: 3000
      })

      setTimeout(() => onClose(), 1000)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'API Error',
        detail: error.response?.data?.message || 'An unexpected error occurred',
        life: 3000
      })
    }
  }

  const renderInput = (field: keyof Supplier, label: string, type: 'text' = 'text') => (
    <FloatLabel className="flex-1 always-float">
      <InputText
        id={field}
        value={formData[field] as string}
        className="w-full"
        onChange={(e) => handleChange(field, e.target.value)}
        type={type}
      />
      <label htmlFor={field}>{label}</label>
    </FloatLabel>
  )

  return (
    <div className="p-4 pb-20">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <p className="text-xl font-semibold mb-4">{mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}</p>

      <p className="font-medium text-sm mt-4 mb-2">Basic Details</p>
      <div className="flex gap-4">{renderInput('supplierName', 'Supplier Name*')}{renderInput('supplierCompanyName', 'Company Name*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierCode', 'Supplier Code*')}
        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="status"
            value={formData.supplierIsActive}
            onChange={(e: DropdownChangeEvent) => handleChange('supplierIsActive', e.value)}
            options={statusOptions}
            optionLabel="name"
            optionValue="value"
            className="w-full"
          />
          <label htmlFor="status">Status</label>
        </FloatLabel>
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Communication Details</p>
      <div className="flex gap-4">{renderInput('supplierEmail', 'Email*')}{renderInput('supplierContactNumber', 'Contact Number*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierDoorNumber', 'Door Number*')}{renderInput('supplierStreet', 'Street*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierCity', 'City*')}{renderInput('supplierState', 'State*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierCountry', 'Country*')}</div>

      <p className="font-medium text-sm mt-5 mb-2">Bank Details</p>
      <div className="flex gap-4">{renderInput('supplierBankName', 'Account Holder Name*')}{renderInput('supplierBankACNumber', 'Account Number*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierIFSC', 'IFSC Code*')}{renderInput('supplierGSTNumber', 'GST Number*')}</div>
      <div className="flex gap-4 mt-3">{renderInput('supplierUPI', 'UPI ID*')}{renderInput('supplierPaymentTerms', 'Payment Terms*')}</div>

      <p className="font-medium text-sm mt-5 mb-2">Emergency Contact</p>
      <div className="flex gap-4">{renderInput('emergencyContactName', 'Emergency Contact Name*')}{renderInput('emergencyContactNumber', 'Emergency Contact Number*')}</div>

      <div className="text-right pt-6">
        <Button label={mode === 'edit' ? 'Update' : 'Save'} icon="pi pi-check" onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default SettingsAddNewSupplier
