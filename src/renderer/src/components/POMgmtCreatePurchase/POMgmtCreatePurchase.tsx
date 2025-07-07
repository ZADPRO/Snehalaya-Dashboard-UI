import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Product } from '../../components/POMgmtViewPurchase/Product';

const AddNewPurchase: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [product, setProduct] = useState<Partial<Product>>({
    refPName: '',
    refPSKU: '',
    refPBrand: '',
    refPStatus: true,
    refPPrice: 0,
    refPMRP: 0,
    // refPCost: 0,
    // refPShortDescription: '',
    // refPLongDescription: '',
    createdBy: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const handleChange = (field: keyof Product, value: string | number | boolean) => {
    setProduct(prev => ({ ...prev, [field]: value }));

    if (field === 'refPPrice' || field === 'refPMRP') {
      const price = parseFloat(field === 'refPPrice' ? value.toString() : product.refPPrice?.toString() || '0');
      const mrp = parseFloat(field === 'refPMRP' ? value.toString() : product.refPMRP?.toString() || '0');
      setProduct(prev => ({
        ...prev,
        refPCost: price, // or use your own logic
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products/create`,
        product,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token') || '',
          },
        }
      );

      if (response.data?.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully',
          life: 3000,
        });

        setProduct({
          refPName: '',
          refPSKU: '',
          refPBrand: '',
          refPStatus: true,
          refPPrice: 0,
          refPMRP: 0,
        //   refPCost: 0,
        //   refPShortDescription: '',
        //   refPLongDescription: '',
          createdBy: '',
          createdAt: new Date().toISOString().split('T')[0],
        });
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data.message || 'Product not added',
          life: 3000,
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Failed to save product',
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-semibold mb-4">Add New Purchase</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          placeholder="Product Name"
          value={product.refPName}
          onChange={(e) => handleChange('refPName', e.target.value)}
        />
        <InputText
          placeholder="SKU"
          value={product.refPSKU}
          onChange={(e) => handleChange('refPSKU', e.target.value)}
        />
        <InputText
          placeholder="Brand"
          value={product.refPBrand}
          onChange={(e) => handleChange('refPBrand', e.target.value)}
        />
        <InputText
          placeholder="Price"
          value={product.refPPrice?.toString() || ''}
          onChange={(e) => handleChange('refPPrice', e.target.value)}
        />
        <InputText
          placeholder="MRP"
          value={product.refPMRP?.toString() || ''}
          onChange={(e) => handleChange('refPMRP', e.target.value)}
        />
        {/* <InputText
          placeholder="Cost"
          value={product.refPCost?.toString() || ''}
          onChange={(e) => handleChange('refPCost', e.target.value)}
        /> */}
        <InputText
          placeholder="Created By"
          value={product.createdBy}
          onChange={(e) => handleChange('createdBy', e.target.value)}
        />
        <InputText
          placeholder="Created At"
          value={product.createdAt}
          onChange={(e) => handleChange('createdAt', e.target.value)}
        />
      </div>

      {/* <div className="mt-4 grid grid-cols-1 gap-4">
        <InputTextarea
          placeholder="Short Description"
          value={product.refPShortDescription}
          onChange={(e) => handleChange('refPShortDescription', e.target.value)}
          rows={2}
          className="w-full"
        />
        <InputTextarea
          placeholder="Long Description"
          value={product.refPLongDescription}
          onChange={(e) => handleChange('refPLongDescription', e.target.value)}
          rows={4}
          className="w-full"
        />
      </div> */}

      <div className="text-right mt-6">
        <Button label="Save Purchase" icon="pi pi-check" onClick={handleSave} />
      </div>
    </div>
  );
};

export default AddNewPurchase;
