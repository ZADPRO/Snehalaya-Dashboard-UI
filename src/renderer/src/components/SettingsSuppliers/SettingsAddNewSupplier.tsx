import React, { useRef, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

interface StatusOption {
  name: string;
  value: boolean;
}

export interface Supplier {
  supplierName: string;
  supplierCompanyName: string;
  supplierCode: string;
  supplierIsActive: boolean;
  supplierEmail: string;
  supplierContactNumber: string;
  supplierDoorNumber: string;
  supplierStreet: string;
  supplierCity: string;
  supplierState: string;
  supplierCountry: string;
  supplierBankName: string;
  supplierBankACNumber: string;
  supplierIFSC: string;
  supplierGSTNumber: string;
  supplierUPI: string;
  supplierPaymentTerms: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  [key: string]: any;
}

interface Props {
  mode: 'add' | 'edit';
  editData?: Supplier | null;
  onSave: (data: Supplier, onSuccess: () => void, onError: (msg: string) => void) => void;
  onUpdate: (data: Supplier, onSuccess: () => void, onError: (msg: string) => void) => void;
  onClose: () => void;
}

const statusOptions: StatusOption[] = [
  { name: 'Active', value: true },
  { name: 'In Active', value: false },
];

const SettingsAddNewSupplier: React.FC<Props> = ({ mode, editData, onSave, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<Supplier>({
    supplierName: '',
    supplierCompanyName: '',
    supplierCode: '',
    supplierIsActive: true,
    supplierEmail: '',
    supplierContactNumber: '',
    supplierDoorNumber: '',
    supplierStreet: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    supplierBankName: '',
    supplierBankACNumber: '',
    supplierIFSC: '',
    supplierGSTNumber: '',
    supplierUPI: '',
    supplierPaymentTerms: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const toast = useRef<Toast>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData(editData);
    }
  }, [mode, editData]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;

  const validateField = (field: keyof Supplier, value: string): string => {
    
    const trimmed = value.trim();
    switch (field) {
      case 'supplierName':
      case 'supplierCompanyName':
      case 'supplierCode':
      case 'supplierDoorNumber':
      case 'supplierStreet':
      case 'supplierCity':
      case 'supplierState':
      case 'supplierCountry':
      case 'supplierBankName':
      case 'supplierBankACNumber':
      case 'supplierIFSC':
      case 'supplierGSTNumber':
      case 'supplierUPI':
      case 'supplierPaymentTerms':
      case 'emergencyContactName':
        if (!trimmed) return `${field.replace(/supplier|emergencyContact/, '').replace(/([A-Z])/g, ' $1')} is required.`;
        break;
      case 'supplierEmail':
        if (!trimmed) return 'Email is required.';
        if (!emailRegex.test(trimmed)) return 'Invalid email format.';
        break;
      case 'supplierContactNumber':
      case 'emergencyContactNumber':
        if (!trimmed) return 'Number is required.';
        if (!mobileRegex.test(trimmed)) return 'Must be 10 digits.';
        break;
    }
    return '';
  };

  const handleChange = (field: keyof Supplier, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    } else if (field === 'supplierIsActive') {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }
  };
 
  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    (Object.keys(formData) as (keyof Supplier)[]).forEach((field) => {
      if (typeof formData[field] === 'string') {
        const err = validateField(field, formData[field] as string);
        if (err) newErrors[field] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const onSuccess = () => {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: `${mode === 'edit' ? 'Updated' : 'Saved'} successfully`, life: 2000 });
      setTimeout(() => onClose(), 1000);
    };

    const onError = (msg: string) => {
      toast.current?.show({ severity: 'warn', summary: 'Failed', detail: msg, life: 4000 });
    };

    if (mode === 'add') {
      onSave(formData, onSuccess, onError);
    } else {
      onUpdate(formData, onSuccess, onError);
    }
  };

const renderInput = (field: keyof Supplier, label: string, type = 'text') => {
  const fieldId = `supplier-${String(field)}`; 

  return (
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id={fieldId}
          type={type}
          value={formData[field] as string}
          className={`w-full ${errors[field] ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange(field, e.target.value)}
        />
        <label htmlFor={fieldId}>{label}</label>
      </FloatLabel>
      {errors[field] && <small style={{ color: 'red' }}>{errors[field]}</small>}
    </div>
  );
};


  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} position="top-right" />
      <p className="font-medium text-sm mt-4 mb-2">Basic Details</p>
      <div className="flex gap-4">
        {renderInput('supplierName', 'Supplier Name*')}
        {renderInput('supplierCompanyName', 'Company Name*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierCode', 'Supplier Code*')}
        <div className="flex-1">
          <FloatLabel className="flex-1 always-float">
            <Dropdown
              id="supplierIsActive"
              value={statusOptions.find((opt) => opt.value === formData.supplierIsActive)}
              onChange={(e: DropdownChangeEvent) => handleChange('supplierIsActive', e.value.value)}
              options={statusOptions}
              optionLabel="name"
              optionValue="value"
              className="w-full"
            />
            <label htmlFor="supplierIsActive">Status</label>
          </FloatLabel>
        </div>
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Communication Details</p>
      <div className="flex gap-4">
        {renderInput('supplierEmail', 'Email*')}
        {renderInput('supplierContactNumber', 'Contact Number*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierDoorNumber', 'Door Number*')}
        {renderInput('supplierStreet', 'Street*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierCity', 'City*')}
        {renderInput('supplierState', 'State*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierCountry', 'Country*')}
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Bank Details</p>
      <div className="flex gap-4">
        {renderInput('supplierBankName', 'Account Holder Name*')}
        {renderInput('supplierBankACNumber', 'Account Number*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierIFSC', 'IFSC Code*')}
        {renderInput('supplierGSTNumber', 'GST Number*')}
      </div>
      <div className="flex gap-4 mt-3">
        {renderInput('supplierUPI', 'UPI ID*')}
        {renderInput('supplierPaymentTerms', 'Payment Terms*')}
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Emergency Contact</p>
      <div className="flex gap-4">
        {renderInput('emergencyContactName', 'Emergency Contact Name*')}
        {renderInput('emergencyContactNumber', 'Emergency Contact Number*')}
      </div>

      <div className="text-right pt-6">
        <Button
          label={mode === 'edit' ? 'Update' : 'Save'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewSupplier;
