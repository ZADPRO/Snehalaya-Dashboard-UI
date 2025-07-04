import React, { useRef, useState } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

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
    <div className="p- pb-20">
      <Toast ref={toast} />

      <p className="text-xl mt-0 font-semibold mb-4">
        {mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
      </p>
      <div className="flex flex-column">
        {/* ---------------- Basic Details ---------------- */}
        <p className="font-semibold text-sm ">Basic Details</p>
        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => handleChange('supplierName', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierName">Supplier Name*</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierCompanyName"
                value={formData.supplierCompanyName}
                onChange={(e) => handleChange('supplierCompanyName', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierCompanyName">Company Name*</label>
            </FloatLabel>
          </div>
        </div>

        <div className="w-[900px] flex mt-3 gap-3">
          <div className="w-[500px]">
            <FloatLabel>
              <InputText
                id="supplierCode"
                value={formData.supplierCode}
                onChange={(e) => handleChange('supplierCode', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierCode">Supplier Code*</label>
            </FloatLabel>
          </div>
        </div>

        {/* Communication Details ---------------- */}
        <p className="font-semibold text-sm mt-3">Communication Details</p>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierEmail"
                value={formData.supplierEmail}
                onChange={(e) => handleChange('supplierEmail', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierEmail">Email</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierContactNumber"
                value={formData.supplierContactNumber}
                onChange={(e) => handleChange('supplierContactNumber', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierContactNumber">Contact Number</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierCity"
                value={formData.supplierCity}
                onChange={(e) => handleChange('supplierCity', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierCity">City</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierStreet"
                value={formData.supplierStreet}
                onChange={(e) => handleChange('supplierStreet', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierStreet">Street Name</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1 ">
            <FloatLabel>
              <InputText
                id="supplierDoorNumber"
                value={formData.supplierDoorNumber}
                onChange={(e) => handleChange('supplierDoorNumber', e.target.value)}
                className="w-[500px]"
              />
              <label htmlFor="supplierDoorNumber">Door No</label>
            </FloatLabel>
          </div>
        </div>

        {/*Bank Details ---------------- */}
        <p className="font-semibold text-sm mt-3">Bank Details</p>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierBankName"
                value={formData.supplierBankName}
                onChange={(e) => handleChange('supplierBankName', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierBankName">Acc Holder Name</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierBankACNumber"
                value={formData.supplierBankACNumber}
                onChange={(e) => handleChange('supplierBankACNumber', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierBankACNumber">Account Number</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierIFSC"
                value={formData.supplierIFSC}
                onChange={(e) => handleChange('supplierIFSC', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierIFSC">IFSC Code</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="supplierGSTNumber"
                value={formData.supplierGSTNumber}
                onChange={(e) => handleChange('supplierGSTNumber', e.target.value)}
                className="w-full"
              />
              <label htmlFor="supplierGSTNumber">GST Number</label>
            </FloatLabel>
          </div>
        </div>

        {/*Emergency Contact ---------------- */}
        <p className="font-semibold text-sm mt-3">Emergency Contact</p>
        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                className="w-full "
              />
              <label htmlFor="emergencyContactName">Emergency Contact Name</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel>
              <InputText
                id="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                className="w-full"
              />
              <label htmlFor="emergencyContactNumber">Emergency Contact No</label>
            </FloatLabel>
          </div>
        </div>

        {/* ---------------- Submit Button ---------------- */}
        <div className="shadow-md p-4 text-right bg-white z-10">
          <Button label="Save" className="gap-2" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default SettingsAddNewSupplier
