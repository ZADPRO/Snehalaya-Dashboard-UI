import React, { useRef, useState } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import PhoneInput from 'react-phone-input-2'

interface Supplier {
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
  supplierIsActive?: boolean
  supplierContactNumber?: string
  emergencyContactName?: string
  emergencyContactNumber?: string
  supplierDoorNumber?: string
  supplierStreet?: string
  supplierCity?: string
  supplierState?: string
  supplierCountry?: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  isDelete?: boolean
}

interface CategoryStatusOptions {
  name: string
  isActive: boolean
}

interface Props {
  mode: 'add' | 'edit'
}

const SettingsAddNewSupplier: React.FC<Props> = ({ mode }) => {
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
    supplierIsActive: true,
    supplierContactNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    supplierDoorNumber: '',
    supplierStreet: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
    isDelete: false
  })

  const statusOptions: CategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  const handleChange = (field: keyof Supplier, value: string | boolean | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any
    }))
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = () => {
    if (!formData.supplierName || !formData.supplierCompanyName || !formData.supplierCode) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Supplier Name, Company and Code are required',
        life: 3000
      })
      return
    }

    if (formData.supplierContactNumber && !/^\d{10}$/.test(formData.supplierContactNumber)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid Mobile',
        detail: 'Supplier mobile must be 10 digits',
        life: 3000
      })
      return
    }

    if (formData.supplierEmail && !validateEmail(formData.supplierEmail)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address',
        life: 3000
      })
      return
    }

    toast.current?.show({
      severity: 'success',
      summary: 'Saved',
      detail: 'Supplier saved successfully',
      life: 3000
    })
  }

  return (
    <div className="p-4 pb-20">
      <Toast ref={toast} />

      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
      </p>

      <div className="flex flex-column gap-4 mt-5">
        {/* Row 1 */}
        <div className="flex gap-4">
          <FloatLabel className="flex-1">
            <InputText
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => handleChange('supplierName', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierName">Supplier Name*</label>
          </FloatLabel>

          <FloatLabel className="flex-1">
            <InputText
              id="supplierCompanyName"
              value={formData.supplierCompanyName}
              onChange={(e) => handleChange('supplierCompanyName', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierCompanyName">Company Name*</label>
          </FloatLabel>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4">
          <FloatLabel className="flex-1">
            <InputText
              id="supplierCode"
              value={formData.supplierCode}
              onChange={(e) => handleChange('supplierCode', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierCode">Supplier Code*</label>
          </FloatLabel>

          <FloatLabel className="flex-1">
            <InputText
              id="supplierEmail"
              value={formData.supplierEmail}
              onChange={(e) => handleChange('supplierEmail', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierEmail">Email</label>
          </FloatLabel>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4">
          <div className="flex-1 w-full">
            <PhoneInput
              country={'in'}
              value={formData.supplierContactNumber}
              countryCodeEditable={false}
              enableSearch={true}
              onChange={(e) => handleChange('supplierContactNumber', e)}
              inputClass="p-inputtext"
              buttonClass="custom-phone-button"
            />
          </div>

          <FloatLabel className="flex-1">
            <InputText
              id="supplierGSTNumber"
              value={formData.supplierGSTNumber}
              onChange={(e) => handleChange('supplierGSTNumber', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierGSTNumber">GST Number</label>
          </FloatLabel>
        </div>

        {/* Row 4 */}
        <div className="flex gap-4">
          <FloatLabel className="flex-1">
            <Dropdown
              inputId="supplierIsActive"
              value={formData.supplierIsActive}
              onChange={(e) => handleChange('supplierIsActive', e.value)}
              options={statusOptions}
              optionLabel="name"
              className="w-full"
              placeholder="Select Status"
            />
            <label htmlFor="supplierIsActive">Status</label>
          </FloatLabel>

          <FloatLabel className="flex-1">
            <InputText
              id="supplierPaymentTerms"
              value={formData.supplierPaymentTerms}
              onChange={(e) => handleChange('supplierPaymentTerms', e.target.value)}
              className="w-full"
            />
            <label htmlFor="supplierPaymentTerms">Payment Terms</label>
          </FloatLabel>
        </div>

        {/* Row 5 */}
        <div className="flex gap-4">
          <FloatLabel className="flex-1">
            <InputText
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              className="w-full"
            />
            <label htmlFor="emergencyContactName">Emergency Contact Name</label>
          </FloatLabel>

          <FloatLabel className="flex-1">
            <InputText
              id="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
              className="w-full"
            />
            <label htmlFor="emergencyContactNumber">Emergency Contact No</label>
          </FloatLabel>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
          <Button label="Save" className="gap-2" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default SettingsAddNewSupplier
