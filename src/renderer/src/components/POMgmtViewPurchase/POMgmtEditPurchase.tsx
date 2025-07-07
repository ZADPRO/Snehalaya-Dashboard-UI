import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Product } from '../../components/POMgmtViewPurchase/Product';

interface Props {
  data: Product | null;
  onBack: () => void;
  onSave: (updatedProduct: Product) => void;
}

const POMgmtEditPurchase: React.FC<Props> = ({ data, onBack, onSave }) => {
  const [formData, setFormData] = React.useState<Product | null>(data);

  if (!formData) return <div>No data to edit</div>;

  const handleChange = (field: keyof Product, value: string | number | boolean) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = () => {
    if (formData) onSave(formData);
  };

  return (
    <div className="p-1">
      <h2 className="mb-3">Edit Product</h2>

      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label>Product Name</label>
          <InputText
            value={formData.refPName}
            onChange={(e) => handleChange('refPName', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>SKU</label>
          <InputText
            value={formData.refPSKU}
            onChange={(e) => handleChange('refPSKU', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Brand</label>
          <InputText
            value={formData.refPBrand}
            onChange={(e) => handleChange('refPBrand', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Status</label>
          <InputText
            value={formData.refPStatus ? 'Active' : 'Inactive'}
            onChange={(e) => handleChange('refPStatus', e.target.value === 'Active')}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Price</label>
          <InputText
            value={formData.refPPrice}
            onChange={(e) => handleChange('refPPrice', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>MRP</label>
          <InputText
            value={formData.refPMRP}
            onChange={(e) => handleChange('refPMRP', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Created By</label>
          <InputText
            value={formData.createdBy}
            onChange={(e) => handleChange('createdBy', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Created At</label>
          <InputText
            value={formData.createdAt}
            onChange={(e) => handleChange('createdAt', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-content-between pt-4">
        {/* <Button label="Back" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary" /> */}
        <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default POMgmtEditPurchase;





// import React, { useState } from 'react';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Product } from '../../components/POMgmtViewPurchase/Product';

// interface Props {
//     data: Product | null;
//     onBack: () => void;
// }

// const POMgmtEditPurchase: React.FC<Props> = ({ data, onBack }) => {
//     if (!data) return <div>No data to edit</div>;

//     const [formData, setFormData] = useState({
//         poId: data.refProductId,
//         poName: data.refPName || '',
//         poDescription: data.refPDescription || '',
//         poHSN: data.refPHSN || '',
//         poQuantity: data.refPQuantity || '',
//         poPrice: data.refPPrice || '',
//         poDiscPercent: data.refPDiscPercent || '',
//         poDisc: data.refPDisc || '',
//         poTotalPrice: data.refPTotalPrice || '',
//     });

//     const [errors, setErrors] = useState<{ [key: string]: string }>({});

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));

//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const validate = () => {
//         const newErrors: { [key: string]: string } = {};
//         if (!formData.poId) newErrors.poId = 'ID is required';
//         if (!formData.poName.trim()) newErrors.poName = 'Name is required';
//         if (!formData.poDescription.trim()) newErrors.poDescription = 'Description is required';
//         return newErrors;
//     };

//     const handleUpdate = () => {
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         // Just console log (no API call)
//         console.log('Validated Data:', formData);
//         alert('Validation successful. Check console for submitted data.');
//     };

//     return (
//         <div className="p-fluid">
//             <h3>Edit: {formData.poName}</h3>

//             <div className="p-field">
//                 <label htmlFor="poId">ID*</label>
//                 <InputText id="poId" name="poId" value={formData.poId.toString()} onChange={handleChange} />
//                 {errors.poId && <small className="p-error">{errors.poId}</small>}
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poName">Name*</label>
//                 <InputText id="poName" name="poName" value={formData.poName} onChange={handleChange} />
//                 {errors.poName && <small className="p-error">{errors.poName}</small>}
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poDescription">Description*</label>
//                 <InputText id="poDescription" name="poDescription" value={formData.poDescription} onChange={handleChange} />
//                 {errors.poDescription && <small className="p-error">{errors.poDescription}</small>}
//             </div>

//             {/* Other optional fields below */}
//             <div className="p-field">
//                 <label htmlFor="poHSN">HSN</label>
//                 <InputText id="poHSN" name="poHSN" value={formData.poHSN} onChange={handleChange} />
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poQuantity">Quantity</label>
//                 <InputText id="poQuantity" name="poQuantity" value={formData.poQuantity} onChange={handleChange} />
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poPrice">Price</label>
//                 <InputText id="poPrice" name="poPrice" value={formData.poPrice} onChange={handleChange} />
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poDiscPercent">Discount %</label>
//                 <InputText id="poDiscPercent" name="poDiscPercent" value={formData.poDiscPercent} onChange={handleChange} />
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poDisc">Discount</label>
//                 <InputText id="poDisc" name="poDisc" value={formData.poDisc} onChange={handleChange} />
//             </div>

//             <div className="p-field">
//                 <label htmlFor="poTotalPrice">Total Price</label>
//                 <InputText id="poTotalPrice" name="poTotalPrice" value={formData.poTotalPrice} onChange={handleChange} />
//             </div>

//             <div className="p-mt-3">
//                 <Button label="Validate" icon="pi pi-check" onClick={handleUpdate} className="p-button-success mr-2" />
//                 <Button label="Back" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary" />
//             </div>
//         </div>
//     );
// };

// export default POMgmtEditPurchase;
