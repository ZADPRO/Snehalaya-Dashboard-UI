import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import axios from 'axios';

export interface Product {
  poId: number;
  poName: string;
  poDescription: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  poTotalPrice: string;
}
interface Props {
  onClose: () => void;
  onRefresh: () => void;
}
const AddNewProduct: React.FC<Props> = ({ onClose, onRefresh }) => {
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState<Product>({
    poId: 0,
    poName: '',
    poDescription: '',
    poHSN: '',
    poQuantity: '',
    poPrice: '',
    poDiscPercent: '',
    poDisc: '',
    poTotalPrice: '',
  });

  const handleChange = (field: keyof Product, value: string) => {
    const updated = { ...formData, [field]: value };
    if (field === 'poPrice' || field === 'poDisc') {
      const price = parseFloat(updated.poPrice) || 0;
      const disc = parseFloat(updated.poDisc) || 0;
      updated.poTotalPrice = (price - disc).toFixed(2);
    }

    setFormData(updated);
  };

  const validateForm = () => {
    if (!formData.poName.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Product Name is required', life: 3000 });
      return false;
    }
    if (!formData.poHSN.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'HSN Code is required', life: 3000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products/create`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token') || '',
          },
        }
      );

      if (response.data.status) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product added', life: 2000 });
        onRefresh();
        setTimeout(() => onClose(), 1000);
      } else {
        throw new Error(response.data.message || 'Create failed');
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add product',
        life: 3000,
      });
    }
  };
  return (
    <div className="p-4 pb-20">
      <Toast ref={toast} />
      <p className="text-xl font-semibold mb-4">Add New Product</p>

      <div className="flex flex-wrap gap-4">
        <InputText
          className="flex-1"
          placeholder="Product Name*"
          value={formData.poName}
          onChange={(e) => handleChange('poName', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="HSN Code*"
          value={formData.poHSN}
          onChange={(e) => handleChange('poHSN', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Quantity"
          value={formData.poQuantity}
          onChange={(e) => handleChange('poQuantity', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Price"
          value={formData.poPrice}
          onChange={(e) => handleChange('poPrice', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Discount %"
          value={formData.poDiscPercent}
          onChange={(e) => handleChange('poDiscPercent', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Discount ₹"
          value={formData.poDisc}
          onChange={(e) => handleChange('poDisc', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Total Price"
          value={formData.poTotalPrice}
          disabled
        />
      </div>

      <div className="mt-4">
        <InputText
          className="w-full"
          placeholder="Description"
          value={formData.poDescription}
          onChange={(e) => handleChange('poDescription', e.target.value)}
        />
      </div>

      <div className="text-right pt-6">
        <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddNewProduct;
