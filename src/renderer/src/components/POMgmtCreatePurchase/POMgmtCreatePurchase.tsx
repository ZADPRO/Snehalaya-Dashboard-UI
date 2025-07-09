import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import { FloatLabel } from 'primereact/floatlabel'
import { generateInvoicePDF } from '../../components/POMgmtCreatePurchase/InvoicePdf'

export interface Product {
  refPName?: string
  refPSKU?: string
  refPBrand?: string
  refPStatus?: boolean
  refPPrice?: number
  refPMRP?: number
  createdBy?: string
  createdAt?: string
}

const AddNewPurchase: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [product, setProduct] = useState<Partial<Product>>({
    refPName: '',
    refPSKU: '',
    refPBrand: '',
    refPStatus: true,
    refPPrice: 0,
    refPMRP: 0,
    createdBy: 'Admin',
    createdAt: new Date().toLocaleString()
  })

  const handleChange = (field: keyof Product, value: string | number | boolean) => {
    setProduct((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products/create`,
        product,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token') || ''
          }
        }
      )

      if (response.data?.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully',
          life: 3000
        })

        setProduct({
          refPName: '',
          refPSKU: '',
          refPBrand: '',
          refPStatus: true,
          refPPrice: 0,
          refPMRP: 0,
          createdBy: 'Admin',
          createdAt: new Date().toLocaleString()
        })
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data.message || 'Product not added',
          life: 3000
        })
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Failed to save product',
        life: 3000
      })
    }
  }

  const handlePrintInvoice = async () => {
    await generateInvoicePDF()
  }

  const isSaveDisabled =
    !product.refPName ||
    !product.refPSKU ||
    !product.refPBrand ||
    !product.refPPrice ||
    !product.refPMRP

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-semibold mb-4">Add New Purchase</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'refPName', label: 'Product Name' },
          { id: 'refPSKU', label: 'SKU' },
          { id: 'refPBrand', label: 'Brand' },
          { id: 'refPPrice', label: 'Price', type: 'number' },
          { id: 'refPMRP', label: 'MRP', type: 'number' }
        ].map(({ id, label, type }) => (
          <FloatLabel className="always-float" key={id}>
            <InputText
              id={id}
              value={String(product[id as keyof Product] || '')}
              onChange={(e) =>
                handleChange(
                  id as keyof Product,
                  type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                )
              }
              className="w-full"
            />
            <label htmlFor={id}>{label}</label>
          </FloatLabel>
        ))}
      </div>

      <div className="text-right mt-6">
        <Button
          label="Print Invoice"
          icon="pi pi-print"
          className="mr-2 gap-2"
          onClick={handlePrintInvoice}
          severity="secondary"
        />
        <Button
          label="Save Purchase"
          icon="pi pi-check"
          className=" gap-2"
          onClick={handleSave}
          disabled={isSaveDisabled}
        />
      </div>
    </div>
  )
}

export default AddNewPurchase
