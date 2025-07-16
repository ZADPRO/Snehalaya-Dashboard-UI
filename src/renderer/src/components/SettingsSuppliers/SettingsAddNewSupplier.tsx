import React, { useRef ,useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';


interface StatusOption {
  name: string;
  value: boolean;
}

interface SupplierFormData {
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
}

interface SettingsAddNewSupplierProps {
  mode: 'add' | 'edit';
  editData?: SupplierFormData | null;
  onSave: (newSupplier: SupplierFormData) => void;
  onUpdate: (updatedSupplier: SupplierFormData) => void;
  onClose: () => void;
}

const statusOptions: StatusOption[] = [
  { name: 'Active', value: true },
  { name: 'In Active', value: false },
];

const SettingsAddNewSupplier: React.FC<SettingsAddNewSupplierProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData(editData);
    }
  }, [mode, editData]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;
const toast = useRef<Toast>(null);

  const validateField = (field: keyof SupplierFormData, value: string): string => {
    const trimmed = value.trim();

    switch (field) {
      case 'supplierName':
        if (!trimmed) return 'Supplier Name is required.';
        break;
      case 'supplierCompanyName':
        if (!trimmed) return 'Company Name is required.';
        break;
      case 'supplierCode':
        if (!trimmed) return 'Supplier Code is required.';
        break;
      case 'supplierEmail':
        if (!trimmed) return 'Email is required.';
        if (!emailRegex.test(trimmed)) return 'Invalid email format.';
        break;
      case 'supplierContactNumber':
        if (!trimmed) return 'Contact Number is required.';
        if (!mobileRegex.test(trimmed)) return 'Contact Number must be 10 digits.';
        break;
      case 'supplierDoorNumber':
        if (!trimmed) return 'Door Number is required.';
        break;
      case 'supplierStreet':
        if (!trimmed) return 'Street is required.';
        break;
      case 'supplierCity':
        if (!trimmed) return 'City is required.';
        break;
      case 'supplierState':
        if (!trimmed) return 'State is required.';
        break;
      case 'supplierCountry':
        if (!trimmed) return 'Country is required.';
        break;
      case 'supplierBankName':
        if (!trimmed) return 'Account Holder Name is required.';
        break;
      case 'supplierBankACNumber':
        if (!trimmed) return 'Account Number is required.';
        break;
      case 'supplierIFSC':
        if (!trimmed) return 'IFSC Code is required.';
        break;
      case 'supplierGSTNumber':
        if (!trimmed) return 'GST Number is required.';
        break;
      case 'supplierUPI':
        if (!trimmed) return 'UPI ID is required.';
        break;
      case 'supplierPaymentTerms':
        if (!trimmed) return 'Payment Terms are required.';
        break;
      case 'emergencyContactName':
        if (!trimmed) return 'Emergency Contact Name is required.';
        break;
      case 'emergencyContactNumber':
        if (!trimmed) return 'Emergency Contact Number is required.';
        if (!mobileRegex.test(trimmed)) return 'Emergency Contact Number must be 10 digits.';
        break;
    }

    return '';
  };

  const handleChange = (field: keyof SupplierFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: error,
      }));
    } else if (field === 'supplierIsActive') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  const isSaveDisabled =
    Object.values(errors).some((err) => err) ||
    !formData.supplierName.trim() ||
    !formData.supplierCompanyName.trim() ||
    !formData.supplierCode.trim() ||
    !formData.supplierEmail.trim() ||
    !formData.supplierContactNumber.trim() ||
    !formData.supplierDoorNumber.trim() ||
    !formData.supplierStreet.trim() ||
    !formData.supplierCity.trim() ||
    !formData.supplierState.trim() ||
    !formData.supplierCountry.trim() ||
    !formData.supplierBankName.trim() ||
    !formData.supplierBankACNumber.trim() ||
    !formData.supplierIFSC.trim() ||
    !formData.supplierGSTNumber.trim() ||
    !formData.supplierUPI.trim() ||
    !formData.supplierPaymentTerms.trim() ||
    !formData.emergencyContactName.trim() ||
    !formData.emergencyContactNumber.trim();

  const handleSubmit = () => {
    
    let newErrors: { [key: string]: string } = {};
    (Object.keys(formData) as (keyof SupplierFormData)[]).forEach((field) => {
      const val = formData[field];
      if (typeof val === 'string') {
        const err = validateField(field, val);
        if (err) newErrors[field] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (mode === 'add') {
      onSave(formData);
    } else {
      onUpdate(formData);
    }
    setTimeout(() => onClose(), 500);
  };

  const renderInput = (field: keyof SupplierFormData, label: string, type = 'text') => (
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id={field}
          type={type}
          value={formData[field] as string}
          className={`w-full ${errors[field] ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange(field, e.target.value)}
        />
        <label htmlFor={field}>{label}</label>
      </FloatLabel>
      {errors[field] && <small style={{ color: 'red' }}>{errors[field]}</small>}
    </div>
  );

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
          disabled={isSaveDisabled}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewSupplier;
