import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';

interface ProductPayload {
  poName: string;
  poDescription: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  poTotalPrice: string;
}

const AddProduct: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [product, setProduct] = useState<ProductPayload>({
    poName: '',
    poDescription: '',
    poHSN: '',
    poQuantity: '',
    poPrice: '',
    poDiscPercent: '',
    poDisc: '',
    poTotalPrice: '',
  });

  const handleChange = (field: keyof ProductPayload, value: string) => {
    const numericFields: (keyof ProductPayload)[] = [
      'poHSN',
      'poQuantity',
      'poPrice',
      'poDiscPercent',
      'poDisc',
      'poTotalPrice',
    ];

    if (numericFields.includes(field)) {
      if (!/^\d*\.?\d*$/.test(value)) return; // block invalid numeric input
    }

    setProduct((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate discount and total price
      const price = parseFloat(updated.poPrice);
      const percent = parseFloat(updated.poDiscPercent);

      if (!isNaN(price) && !isNaN(percent)) {
        const discount = parseFloat(((price * percent) / 100).toFixed(2));
        const total = parseFloat((price - discount).toFixed(2));
        updated.poDisc = discount.toString();
        updated.poTotalPrice = total.toString();
      }

      return updated;
    });
  };

  const handleSaveProduct = async () => {
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
          detail: 'Product created successfully',
          life: 2000,
        });

        setProduct({
          poName: '',
          poDescription: '',
          poHSN: '',
          poQuantity: '',
          poPrice: '',
          poDiscPercent: '',
          poDisc: '',
          poTotalPrice: '',
        });
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Failed',
          detail: response.data?.message || 'Unknown error',
          life: 2000,
        });
      }
    } catch (error: any) {
      console.error('Product creation error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Failed to create product',
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          placeholder="Product Name"
          value={product.poName}
          onChange={(e) => handleChange('poName', e.target.value)}
        />
        <InputText
          placeholder="HSN"
          value={product.poHSN}
          onChange={(e) => handleChange('poHSN', e.target.value)}
        />
        <InputText
          placeholder="Quantity"
          value={product.poQuantity}
          onChange={(e) => handleChange('poQuantity', e.target.value)}
        />
        <InputText
          placeholder="Price"
          value={product.poPrice}
          onChange={(e) => handleChange('poPrice', e.target.value)}
        />
        <InputText
          placeholder="Discount %"
          value={product.poDiscPercent}
          onChange={(e) => handleChange('poDiscPercent', e.target.value)}
        />
        <InputText
          placeholder="Discount Value"
          value={product.poDisc}
          disabled
        />
        <InputText
          placeholder="Total Price"
          value={product.poTotalPrice}
          disabled
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputTextarea
          rows={4}
          className="w-full"
          placeholder="Product Description"
          value={product.poDescription}
          onChange={(e) => handleChange('poDescription', e.target.value)}
        />
      </div>

      <div className="text-right mt-6">
        <Button
          label="Save Product"
          icon="pi pi-check"
          onClick={handleSaveProduct}
        />
      </div>
    </div>
  );
};

export default AddProduct;






// import React, { useRef, useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { Editor } from 'primereact/editor';
// import axios from 'axios';

// interface Product {
//   refProductId: number;
//   refPName: string;
//   refPSKU: string;
//   refPStatus: boolean;
//   refPType: string;
//   refGtIn: string;
//   refSize: string;
//   rePPriceCode: string;
//   refPBrand: string;
//   refPCategoryId: string;
//   refSubCategoryId: string;
//   refPTaxClass: string;
//   refPUnits: string;
//   refPPrice: string;
//   refPMRP: string;
//   refPCost: string;
//   refPFeatured: boolean;
//   refPPublishState: boolean;
//   refPShortDescription: string;
//   refPLongDescription: string;
//   refProductImages: string[];
//   refPurchaseAccount: string;
//   refSalesAccount: string;
//   availableStores: string;
//   createdAt: string;
//   createdBy: string;
//   updatedAt: string;
//   updatedBy: string;
// }

// interface Props {
//   onClose: () => void;
//   onRefresh: () => void;
// }

// const AddNewProduct: React.FC<Props> = ({ onClose, onRefresh }) => {
//   const toast = useRef<Toast>(null);

//   const [formData, setFormData] = useState<Product>({
//     refProductId: 0,
//     refPName: '',
//     refPSKU: '',
//     refPStatus: true,
//     refPType: '',
//     refGtIn: '',
//     refSize: '',
//     rePPriceCode: '',
//     refPBrand: '',
//     refPCategoryId: '',
//     refSubCategoryId: '',
//     refPTaxClass: '',
//     refPUnits: '',
//     refPPrice: '',
//     refPMRP: '',
//     refPCost: '',
//     refPFeatured: false,
//     refPPublishState: true,
//     refPShortDescription: '',
//     refPLongDescription: '',
//     refProductImages: [],
//     refPurchaseAccount: '',
//     refSalesAccount: '',
//     availableStores: '',
//     createdAt: new Date().toISOString(),
//     createdBy: 'admin',
//     updatedAt: new Date().toISOString(),
//     updatedBy: 'admin',
//   });

//   const [images, setImages] = useState<File[]>([]);

//   const handleChange = (field: keyof Product, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImages(Array.from(e.target.files));
//     }
//   };

//   const handleCancelImages = () => {
//     setImages([]);
//   };

//   const validateForm = () => {
//     if (!formData.refPName.trim()) {
//       toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Product Name is required', life: 3000 });
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const formPayload = new FormData();
//       formPayload.append('product', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

//       images.forEach(file => {
//         formPayload.append('images', file);
//       });

//       const response = await axios.post(`http://localhost:8080/api/v1/admin/products/create`, formPayload, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: sessionStorage.getItem('token') || '',
//         },
//       });

//       if (response.data.status) {
//         toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product added successfully', life: 2000 });
//         onRefresh();
//         setTimeout(() => onClose(), 1000);
//       } else {
//         throw new Error(response.data.message || 'Product creation failed');
//       }
//     } catch (error) {
//       toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add product', life: 3000 });
//     }
//   };

//   return (
//     <div className="p-4 pb-20">
//       <Toast ref={toast} />
//       <p className="text-xl font-semibold mb-4">Add New Product</p>

//       <div className="flex flex-wrap gap-4">
//         <InputText className="flex-1" placeholder="Name" value={formData.refPName} onChange={(e) => handleChange('refPName', e.target.value)} />
//         <InputText className="flex-1" placeholder="SKU" value={formData.refPSKU} onChange={(e) => handleChange('refPSKU', e.target.value)} />
//         <InputText className="flex-1" placeholder="GTIN" value={formData.refGtIn} onChange={(e) => handleChange('refGtIn', e.target.value)} />
//         <InputText className="flex-1" placeholder="Size" value={formData.refSize} onChange={(e) => handleChange('refSize', e.target.value)} />
//         <InputText className="flex-1" placeholder="Price Code" value={formData.rePPriceCode} onChange={(e) => handleChange('rePPriceCode', e.target.value)} />
//         <InputText className="flex-1" placeholder="Brand" value={formData.refPBrand} onChange={(e) => handleChange('refPBrand', e.target.value)} />
//         <InputText className="flex-1" placeholder="Category ID" value={formData.refPCategoryId} onChange={(e) => handleChange('refPCategoryId', e.target.value)} />
//         <InputText className="flex-1" placeholder="SubCategory ID" value={formData.refSubCategoryId} onChange={(e) => handleChange('refSubCategoryId', e.target.value)} />
//         <InputText className="flex-1" placeholder="Tax Class" value={formData.refPTaxClass} onChange={(e) => handleChange('refPTaxClass', e.target.value)} />
//         <InputText className="flex-1" placeholder="Units" value={formData.refPUnits} onChange={(e) => handleChange('refPUnits', e.target.value)} />
//         <InputText className="flex-1" placeholder="Price" value={formData.refPPrice} onChange={(e) => handleChange('refPPrice', e.target.value)} />
//         <InputText className="flex-1" placeholder="MRP" value={formData.refPMRP} onChange={(e) => handleChange('refPMRP', e.target.value)} />
//         <InputText className="flex-1" placeholder="Cost" value={formData.refPCost} onChange={(e) => handleChange('refPCost', e.target.value)} />
//         <InputText className="flex-1" placeholder="Purchase Account" value={formData.refPurchaseAccount} onChange={(e) => handleChange('refPurchaseAccount', e.target.value)} />
//         <InputText className="flex-1" placeholder="Sales Account" value={formData.refSalesAccount} onChange={(e) => handleChange('refSalesAccount', e.target.value)} />
//         <InputText className="flex-1" placeholder="Available Stores" value={formData.availableStores} onChange={(e) => handleChange('availableStores', e.target.value)} />
//       </div>

//       <div className="mt-4">
//         <InputTextarea className="w-full" rows={3} placeholder="Short Description" value={formData.refPShortDescription} onChange={(e) => handleChange('refPShortDescription', e.target.value)} />
//       </div>

//       <div className="mt-4">
//         <label className="font-semibold">Long Description</label>
//         <Editor value={formData.refPLongDescription} onTextChange={(e) => handleChange('refPLongDescription', e.htmlValue || '')} style={{ height: '200px' }} />
//       </div>

//       <div className="mt-4">
//         <label className="font-semibold mb-2 block">Choose Product Images</label>
//         <input type="file" accept="image/*" multiple onChange={handleImageChange} />
//         <div className="flex gap-2 mt-2">
//           {images.map((img, i) => (
//             <img key={i} src={URL.createObjectURL(img)} alt="preview" className="w-20 h-20 object-cover rounded" />
//           ))}
//         </div>
//         {images.length > 0 && (
//           <Button label="Cancel Images" className="mt-2" icon="pi pi-times" severity="danger" onClick={handleCancelImages} />
//         )}
//       </div>

//       <div className="text-right mt-6">
//         <Button label="Save Product" icon="pi pi-check" onClick={handleSubmit} />
//       </div>
//     </div>
//   );
// };

// export default AddNewProduct;
