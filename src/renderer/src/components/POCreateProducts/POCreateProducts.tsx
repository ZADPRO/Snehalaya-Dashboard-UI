import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import { FloatLabel } from 'primereact/floatlabel'

interface ProductPayload {
  poName: string
  poDescription: string
  poHSN: string
  poQuantity: string
  poPrice: string
  poDiscPercent: string
  poDisc: string
  poTotalPrice: string
}

const AddProduct: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [isDirty, setIsDirty] = useState(false)

  const [product, setProduct] = useState<ProductPayload>({
    poName: '',
    poDescription: '',
    poHSN: '',
    poQuantity: '',
    poPrice: '',
    poDiscPercent: '',
    poDisc: '',
    poTotalPrice: ''
  })

  const handleChange = (field: keyof ProductPayload, value: string) => {
    const currentValue = product[field]

    if (currentValue === value) return

    setIsDirty(true)

    const numericFields: (keyof ProductPayload)[] = [
      'poHSN',
      'poQuantity',
      'poPrice',
      'poDiscPercent',
      'poDisc',
      'poTotalPrice'
    ]

    if (numericFields.includes(field)) {
      if (!/^\d*\.?\d*$/.test(value)) return
    }

    setProduct((prev) => {
      const updated = { ...prev, [field]: value }

      const quantity = parseFloat(updated.poQuantity)
      const price = parseFloat(updated.poPrice)
      const discountPercent = parseFloat(updated.poDiscPercent)

      if (!isNaN(quantity) && !isNaN(price)) {
        const baseAmount = quantity * price

        if (!isNaN(discountPercent)) {
          const discount = parseFloat(((baseAmount * discountPercent) / 100).toFixed(2))
          const total = parseFloat((baseAmount - discount).toFixed(2))
          updated.poDisc = discount.toString()
          updated.poTotalPrice = total.toString()
        } else {
          updated.poDisc = ''
          updated.poTotalPrice = baseAmount.toFixed(2)
        }
      } else {
        updated.poDisc = ''
        updated.poTotalPrice = ''
      }

      return updated
    })
  }

  const handleSaveProduct = async () => {
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
          detail: 'Product created successfully',
          life: 2000
        })

        setProduct({
          poName: '',
          poDescription: '',
          poHSN: '',
          poQuantity: '',
          poPrice: '',
          poDiscPercent: '',
          poDisc: '',
          poTotalPrice: ''
        })

        setIsDirty(false)
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Failed',
          detail: response.data?.message || 'Unknown error',
          life: 2000
        })
      }
    } catch (error: any) {
      console.error('Product creation error:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Failed to create product',
        life: 3000
      })
    }
  }

  return (
    <div className="p-4">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <FloatLabel className="always-float">
          <InputText
            id="poName"
            value={product.poName}
            onChange={(e) => handleChange('poName', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poName">Product Name</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <InputText
            id="poPrice"
            value={product.poPrice}
            onChange={(e) => handleChange('poPrice', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poPrice">Price</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <InputText
            id="poDiscPercent"
            value={product.poDiscPercent}
            onChange={(e) => handleChange('poDiscPercent', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poDiscPercent">Discount %</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <InputText id="poDisc" value={product.poDisc} disabled className="w-full" />
          <label htmlFor="poDisc">Discount Value</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <InputText id="poTotalPrice" value={product.poTotalPrice} disabled className="w-full" />
          <label htmlFor="poTotalPrice">Total Price</label>
        </FloatLabel>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Editor
          value={product.poDescription}
          onTextChange={(e: EditorTextChangeEvent) =>
            handleChange('poDescription', e.htmlValue || '')
          }
          style={{ height: '220px' }}
          className="w-full"
        />
      </div>

      <div className="text-right mt-6">
        <Button
          label="Save Product"
          icon="pi pi-check"
          className=" gap-2"
          onClick={handleSaveProduct}
          disabled={!isDirty}
        />
      </div>
    </div>
  )
}

export default AddProduct
