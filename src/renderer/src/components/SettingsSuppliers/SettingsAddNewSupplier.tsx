import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';

interface StatusOption {
  name: string;
  value: boolean;
}

export interface Supplier {
  supplierId: number;
  supplierName?: string;
  supplierCompanyName?: string;
  supplierCode?: string;
  supplierEmail?: string;
  supplierGSTNumber?: string;
  supplierPaymentTerms?: string;
  supplierBankACNumber?: string;
  supplierIFSC?: string;
  supplierBankName?: string;
  supplierUPI?: string;
  supplierIsActive?: string | boolean;
  supplierContactNumber?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  supplierDoorNumber?: string;
  supplierStreet?: string;
  supplierCity?: string;
  supplierState?: string;
  supplierCountry?: string;
  isDelete?: boolean;
}

interface Props {
  mode: 'add' | 'edit';
  editData?: Supplier | null;
  onClose: () => void;
  onSave?: (supplier: Supplier) => Promise<void>;
  onUpdate?: (supplier: Supplier) => Promise<void>;
}

const SettingsAddNewSupplier: React.FC<Props> = ({ mode, editData, onClose, onSave, onUpdate }) => {
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState<Supplier>({
    supplierId: 0,
    supplierName: '',
    supplierCompanyName: '',
    supplierCode: '',
    supplierEmail: '',
    supplierGSTNumber: '',
    supplierPaymentTerms: '',
    supplierBankACNumber: '',
    supplierIFSC: '',
    supplierBankName: '',
    supplierUPI: '',
    supplierIsActive: 'true',
    supplierContactNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    supplierDoorNumber: '',
    supplierStreet: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    isDelete: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const statusOptions: StatusOption[] = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({ ...editData });
    }
  }, [mode, editData]);

  const validateField = (field: keyof Supplier, value: any): string => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const upiRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;
    const accountNumberRegex = /^\d{9,18}$/;

    switch (field) {
      case 'supplierEmail':
        if (!trimmed) return 'Email is required.';
        if (!emailRegex.test(trimmed)) return 'Invalid email format.';
        break;
      case 'supplierContactNumber':
        if (!trimmed) return 'Contact number is required.';
        if (!mobileRegex.test(trimmed)) return 'Invalid contact number.';
        break;
      case 'emergencyContactNumber':
        if (!trimmed) return 'Emergency contact number is required.';
        if (!mobileRegex.test(trimmed)) return 'Invalid emergency contact number.';
        break;
      case 'supplierBankACNumber':
        if (!trimmed) return 'Account number is required.';
        if (!accountNumberRegex.test(trimmed)) return 'Invalid account number.';
        break;
    }
    return '';
  };

  const isSaveDisabled =
    Object.values(errors).some((error) => error !== '') ||
    !formData.supplierEmail ||
    !formData.supplierContactNumber ||
    !formData.supplierBankACNumber ||
    !formData.emergencyContactNumber;

  const handleChange = (field: keyof Supplier, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const renderError = (field: string) =>
    errors[field] && <small style={{ color: 'red' }}>{errors[field]}</small>;

  const renderInput = (field: keyof Supplier, label: string, type: 'text' | 'number' = 'text') => {
    const isNumberField =
      field === 'supplierContactNumber' ||
      field === 'emergencyContactNumber' ||
      field === 'supplierBankACNumber';

    return (
      <div className="flex-1">
        <FloatLabel className="flex-1 always-float">
          {isNumberField ? (
            <InputNumber
              id={field}
              value={formData[field] ? parseInt(formData[field] as string) : undefined}
              onValueChange={(e) => handleChange(field, e.value?.toString() || '')}
              useGrouping={false}
              className={`w-full ${errors[field] ? 'p-invalid' : ''}`}
            />
          ) : (
            <InputText
              id={field}
              value={formData[field] as string}
              className={`w-full ${errors[field] ? 'p-invalid' : ''}`}
              onChange={(e) => handleChange(field, e.target.value)}
              type={type}
            />
          )}
          <label htmlFor={field}>{label}</label>
        </FloatLabel>
        {renderError(field)}
      </div>
    );
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof Supplier)[] = [
      'supplierEmail',
      'supplierContactNumber',
      'supplierBankACNumber',
      'emergencyContactNumber',
    ];

    const newErrors: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors before saving.',
      });
      return;
    }

    try {
      if (mode === 'add' && onSave) {
        await onSave(formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Saved',
          detail: 'Supplier added successfully',
        });
      } else if (mode === 'edit' && onUpdate) {
        await onUpdate(formData);
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Supplier updated successfully',
        });
      }
      onClose();
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong while saving.',
      });
    }
  };

  return (
    <div className="p-4 pb-20">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
      </p>

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
              id="status"
              value={formData.supplierIsActive}
              onChange={(e: DropdownChangeEvent) => handleChange('supplierIsActive', e.value)}
              options={statusOptions}
              optionLabel="name"
              optionValue="value"
              className="w-full"
            />
            <label htmlFor="status">Status</label>
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
