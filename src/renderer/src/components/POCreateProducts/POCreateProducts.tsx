import React, { useState, useRef, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'

interface ProductPayload {
  poName: string
  poDescription: string
  categoryName: string // will hold refCategoryId
  poPrice: string
  poDiscPercent: string
  poDisc: string
  dummySKU: string
}

interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

const AddProduct: React.FC = () => {
  const toast = useRef<Toast>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [product, setProduct] = useState<ProductPayload>({
    poName: '',
    poDescription: '',
    categoryName: '',
    poPrice: '',
    poDiscPercent: '',
    poDisc: '',
    dummySKU: ''
  })

  useEffect(() => {
    const localCategories = localStorage.getItem('categories')
    if (localCategories) {
      setCategories(JSON.parse(localCategories))
    } else {
      fetchCategories()
    }
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/categories`, {
        headers: { Authorization: sessionStorage.getItem('token') || '' }
      })
      if (res.data?.status) {
        setCategories(res.data.data)
        localStorage.setItem('categories', JSON.stringify(res.data.data))
      } else throw new Error(res.data.message)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load categories',
        life: 3000
      })
    }
  }

  const handleChange = (field: keyof ProductPayload, value: string) => {
    const currentValue = product[field]
    if (currentValue === value) return
    setIsDirty(true)

    const numericFields: (keyof ProductPayload)[] = ['poPrice', 'poDiscPercent', 'poDisc']
    if (numericFields.includes(field) && !/^\d*\.?\d*$/.test(value)) return

    const updatedProduct = { ...product, [field]: value }

    // Calculate discount value if price and percentage are valid
    if (field === 'poPrice' || field === 'poDiscPercent') {
      const price = parseFloat(updatedProduct.poPrice) || 0
      const discount = parseFloat(updatedProduct.poDiscPercent) || 0
      updatedProduct.poDisc = ((price * discount) / 100).toFixed(2)
    }

    setProduct(updatedProduct)
  }

  const generateSKU = (): string => {
    const today = new Date()
    const dateStr = `${String(today.getDate()).padStart(2, '0')}${String(
      today.getMonth() + 1
    ).padStart(2, '0')}${String(today.getFullYear()).slice(-2)}`
    const products = JSON.parse(localStorage.getItem('products') || '[]')
    const nextId = products.length + 1
    const paddedId = String(nextId).padStart(4, '0')
    return `SKU${dateStr}${paddedId}`
  }

  const handleSaveProduct = () => {
    const finalProduct = {
      ...product,
      dummySKU: generateSKU()
    }

    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]')
    const updatedProducts = [...existingProducts, finalProduct]

    localStorage.setItem('products', JSON.stringify(updatedProducts))

    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Product stored locally',
      life: 2000
    })

    setProduct({
      poName: '',
      poDescription: '',
      categoryName: '',
      poPrice: '',
      poDiscPercent: '',
      poDisc: '',
      dummySKU: ''
    })

    setIsDirty(false)
  }

  return (
    <div className="p-4">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <FloatLabel className="always-float flex-1">
          <Dropdown
            id="categoryName"
            value={product.categoryName}
            options={categories.map((cat) => ({
              label: cat.categoryName,
              value: cat.refCategoryId.toString()
            }))}
            onChange={(e) => handleChange('categoryName', e.value)}
            className="w-full"
          />
          <label htmlFor="categoryName">Category</label>
        </FloatLabel>

        <FloatLabel className="always-float flex-1">
          <InputText
            id="poName"
            value={product.poName}
            onChange={(e) => handleChange('poName', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poName">Product Name</label>
        </FloatLabel>

        <FloatLabel className="always-float flex-1">
          <InputText
            id="poPrice"
            value={product.poPrice}
            onChange={(e) => handleChange('poPrice', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poPrice">Price</label>
        </FloatLabel>

        <FloatLabel className="always-float flex-1">
          <InputText
            id="poDiscPercent"
            value={product.poDiscPercent}
            onChange={(e) => handleChange('poDiscPercent', e.target.value)}
            className="w-full"
          />
          <label htmlFor="poDiscPercent">Discount %</label>
        </FloatLabel>

        <FloatLabel className="always-float flex-1">
          <InputText id="poDisc" value={product.poDisc} disabled className="w-full" />
          <label htmlFor="poDisc">Discount Value</label>
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
