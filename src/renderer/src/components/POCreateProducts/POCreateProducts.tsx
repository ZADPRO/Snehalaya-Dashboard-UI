import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';

interface ProductFormState {
  refPName: string;
  refPType: string;
  refPSKU: string;
  refGtIn: string;
  refSize: number;
  rePPriceCode: string;
  refPBrand: string;
  refPCategoryId: number | null;
  refSubCategoryId: number | null;
  refPTaxClass: string;
  refPUnits: string;
  refPPrice: string;
  refPMRP: string;
  refPCost: string;
  refPFeatured: boolean;
  refPPublishState: string;
  refPShortDescription: string;
  refPLongDescription: string;
  refProductImages: File[];
  refPurchaseAccount: string;
  refSalesAccount: string;
}

const AddNewProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormState>({
    refPName: '',
    refPType: '',
    refPSKU: '',
    refGtIn: '',
    refSize: 0,
    rePPriceCode: '',
    refPBrand: '',
    refPCategoryId: null,
    refSubCategoryId: null,
    refPTaxClass: '',
    refPUnits: '',
    refPPrice: '',
    refPMRP: '',
    refPCost: '',
    refPFeatured: false,
    refPPublishState: '',
    refPShortDescription: '',
    refPLongDescription: '',
    refProductImages: [],
    refPurchaseAccount: '',
    refSalesAccount: ''
  });

  // Dummy data
  const categories = [
    { label: 'Electronics', value: 1 },
    { label: 'Apparel', value: 2 },
    { label: 'Home Appliances', value: 3 }
  ];

  const subCategories = [
    { label: 'Mobile', value: 101 },
    { label: 'T-Shirts', value: 102 },
    { label: 'Washing Machine', value: 103 }
  ];

  const taxClasses = [
    { label: 'GST 18%', value: 'GST18' },
    { label: 'GST 12%', value: 'GST12' },
    { label: 'No Tax', value: 'NO_TAX' }
  ];

  const unitOptions = [
    { label: 'Pieces', value: 'pcs' },
    { label: 'Kg', value: 'kg' },
    { label: 'Liters', value: 'ltr' }
  ];

  const publishOptions = [
    { label: 'Published', value: 'true' },
    { label: 'Draft', value: 'false' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof ProductFormState) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleDropdownChange = (e: any, field: keyof ProductFormState) => {
    setFormData({ ...formData, [field]: e.value });
  };

  const handleEditorChange = (value: string) => {
    setFormData({ ...formData, refPLongDescription: value });
  };

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.files) as File[];
    setFormData((prev) => ({ ...prev, refProductImages: files }));
  };

  const handleSubmit = () => {
    console.log('Submitted Product:', formData);
  };

  return (
    <div className="card p-fluid">
      <h3>Create Product</h3>

      <div className="formgrid grid">
        <div className="field col-6">
          <label>Product Name</label>
          <InputText value={formData.refPName} onChange={(e) => handleInputChange(e, 'refPName')} />
        </div>

        <div className="field col-6">
          <label>SKU</label>
          <InputText value={formData.refPSKU} onChange={(e) => handleInputChange(e, 'refPSKU')} />
        </div>

        <div className="field col-6">
          <label>Type</label>
          <InputText value={formData.refPType} onChange={(e) => handleInputChange(e, 'refPType')} />
        </div>

        <div className="field col-6">
          <label>GTIN</label>
          <InputText value={formData.refGtIn} onChange={(e) => handleInputChange(e, 'refGtIn')} />
        </div>

        <div className="field col-6">
          <label>Brand</label>
          <InputText value={formData.refPBrand} onChange={(e) => handleInputChange(e, 'refPBrand')} />
        </div>

        <div className="field col-6">
          <label>Size</label>
          <InputText value={formData.refSize} onChange={(e) => handleInputChange(e, 'refSize')} />
        </div>

        <div className="field col-6">
          <label>Price Code</label>
          <InputText value={formData.rePPriceCode} onChange={(e) => handleInputChange(e, 'rePPriceCode')} />
        </div>

        <div className="field col-6">
          <label>Category</label>
          <Dropdown
            value={formData.refPCategoryId}
            options={categories}
            onChange={(e) => handleDropdownChange(e, 'refPCategoryId')}
            placeholder="Select Category"
          />
        </div>

        <div className="field col-6">
          <label>Sub Category</label>
          <Dropdown
            value={formData.refSubCategoryId}
            options={subCategories}
            onChange={(e) => handleDropdownChange(e, 'refSubCategoryId')}
            placeholder="Select Subcategory"
          />
        </div>

        <div className="field col-6">
          <label>Tax Class</label>
          <Dropdown
            value={formData.refPTaxClass}
            options={taxClasses}
            onChange={(e) => handleDropdownChange(e, 'refPTaxClass')}
            placeholder="Select Tax Class"
          />
        </div>

        <div className="field col-6">
          <label>Units</label>
          <Dropdown
            value={formData.refPUnits}
            options={unitOptions}
            onChange={(e) => handleDropdownChange(e, 'refPUnits')}
            placeholder="Select Unit"
          />
        </div>

        <div className="field col-6">
          <label>Price</label>
          <InputText value={formData.refPPrice} onChange={(e) => handleInputChange(e, 'refPPrice')} />
        </div>

        <div className="field col-6">
          <label>MRP</label>
          <InputText value={formData.refPMRP} onChange={(e) => handleInputChange(e, 'refPMRP')} />
        </div>

        <div className="field col-6">
          <label>Cost</label>
          <InputText value={formData.refPCost} onChange={(e) => handleInputChange(e, 'refPCost')} />
        </div>

        <div className="field col-6">
          <label>Publish State</label>
          <Dropdown
            value={formData.refPPublishState}
            options={publishOptions}
            onChange={(e) => handleDropdownChange(e, 'refPPublishState')}
            placeholder="Select Publish State"
          />
        </div>

        <div className="field col-12">
          <label>Short Description</label>
          <InputTextarea value={formData.refPShortDescription} onChange={(e) => handleInputChange(e, 'refPShortDescription')} />
        </div>

        <div className="field col-12">
          <label>Detailed Description</label>
          <Editor value={formData.refPLongDescription} onTextChange={(e) => handleEditorChange(e.htmlValue)} />
        </div>

        <div className="field col-12">
          <label>Upload Product Images</label>
          <FileUpload
            mode="basic"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            auto
            chooseLabel="Add Image"
            uploadHandler={handleImageUpload}
          />
        </div>

        <div className="field col-3 flex align-items-center">
          <Checkbox
            inputId="featured"
            checked={formData.refPFeatured}
            onChange={(e) => setFormData({ ...formData, refPFeatured: e.checked! })}
          />
          <label htmlFor="featured" className="ml-2">Featured</label>
        </div>

        <div className="field col-12 mt-4">
          <Button label="Save Product" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;

