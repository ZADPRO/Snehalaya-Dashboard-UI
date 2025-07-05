import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

interface StatusOption {
  name: string;
  value: boolean;
}

interface Supplier {
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
  supplierIsActive?: boolean;
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
    supplierIsActive: true,
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

  const statusOptions: StatusOption[] = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({ ...editData });
    }
  }, [mode, editData]);

  const handleChange = (field: keyof Supplier, value: string | boolean | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    if (!formData.supplierName?.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Supplier Name is required', life: 3000 });
      return false;
    }
    if (!formData.supplierCompanyName?.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Company Name is required', life: 3000 });
      return false;
    }
    if (!formData.supplierCode?.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Supplier Code is required', life: 3000 });
      return false;
    }
    if (formData.supplierEmail && !validateEmail(formData.supplierEmail)) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Invalid Email format', life: 3000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const supplierPayload: Supplier = {
      ...formData,
      supplierIsActive: formData.supplierIsActive ?? true,
      isDelete: false,
      supplierId: editData?.supplierId ?? 0,
    };

    try {
      if (mode === 'add' && onSave) {
        await onSave(supplierPayload);
      } else if (mode === 'edit' && onUpdate) {
        await onUpdate(supplierPayload);
      } else {
        
        const url =
          mode === 'add'
            ? 'http://localhost:8080/api/v1/admin/suppliers/create'
            : `http://localhost:8080/api/v1/admin/suppliers/update/${supplierPayload.supplierId}`;

        const method = mode === 'add' ? 'POST' : 'PUT';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(supplierPayload),
        });

        const data = await response.json();

        if (data.status === true) {
          localStorage.setItem('token', 'Bearer ' + data.token);
          toast.current?.show({
            severity: 'success',
            summary: mode === 'add' ? 'Saved' : 'Updated',
            detail: data.message || `Supplier ${mode === 'add' ? 'created' : 'updated'} successfully`,
            life: 3000,
          });
          setTimeout(() => onClose(), 1000);
          return;
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Error',
            detail: data.message || 'Something went wrong',
            life: 3000,
          });
          return;
        }
      }

      toast.current?.show({
        severity: 'success',
        summary: mode === 'add' ? 'Saved' : 'Updated',
        detail: `Supplier ${mode === 'add' ? 'created' : 'updated'} successfully`,
        life: 3000,
      });
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'API Error',
        detail: 'An unexpected error occurred',
        life: 3000,
      });
    }
  };

  return (
    <div className="p-4 pb-20">
      <Toast ref={toast} />
      <p className="text-xl font-semibold mb-4">{mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}</p>

      <p className="font-medium text-sm mt-4 mb-2">Basic Details</p>
      <div className="flex gap-4">
        <InputText
          className="flex-1"
          placeholder="Supplier Name*"
          value={formData.supplierName}
          onChange={(e) => handleChange('supplierName', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Company Name*"
          value={formData.supplierCompanyName}
          onChange={(e) => handleChange('supplierCompanyName', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="Supplier Code*"
          value={formData.supplierCode}
          onChange={(e) => handleChange('supplierCode', e.target.value)}
        />
        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="status"
            value={formData.supplierIsActive}
            onChange={(e: DropdownChangeEvent) => handleChange('supplierIsActive', e.value)}
            options={statusOptions}
            optionLabel="name"
            className="w-full"
          />
          <label htmlFor="status">Status</label>
        </FloatLabel>
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Communication Details</p>
      <div className="flex gap-4">
        <InputText
          className="flex-1"
          placeholder="Email"
          value={formData.supplierEmail}
          onChange={(e) => handleChange('supplierEmail', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Contact Number"
          value={formData.supplierContactNumber}
          onChange={(e) => handleChange('supplierContactNumber', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="Door Number"
          value={formData.supplierDoorNumber}
          onChange={(e) => handleChange('supplierDoorNumber', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Street"
          value={formData.supplierStreet}
          onChange={(e) => handleChange('supplierStreet', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="City"
          value={formData.supplierCity}
          onChange={(e) => handleChange('supplierCity', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="State"
          value={formData.supplierState}
          onChange={(e) => handleChange('supplierState', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="Country"
          value={formData.supplierCountry}
          onChange={(e) => handleChange('supplierCountry', e.target.value)}
        />
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Bank Details</p>
      <div className="flex gap-4">
        <InputText
          className="flex-1"
          placeholder="Account Holder Name"
          value={formData.supplierBankName}
          onChange={(e) => handleChange('supplierBankName', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Account Number"
          value={formData.supplierBankACNumber}
          onChange={(e) => handleChange('supplierBankACNumber', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="IFSC Code"
          value={formData.supplierIFSC}
          onChange={(e) => handleChange('supplierIFSC', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="GST Number"
          value={formData.supplierGSTNumber}
          onChange={(e) => handleChange('supplierGSTNumber', e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-3">
        <InputText
          className="flex-1"
          placeholder="UPI ID"
          value={formData.supplierUPI}
          onChange={(e) => handleChange('supplierUPI', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Payment Terms"
          value={formData.supplierPaymentTerms}
          onChange={(e) => handleChange('supplierPaymentTerms', e.target.value)}
        />
      </div>

      <p className="font-medium text-sm mt-5 mb-2">Emergency Contact</p>
      <div className="flex gap-4">
        <InputText
          className="flex-1"
          placeholder="Emergency Contact Name"
          value={formData.emergencyContactName}
          onChange={(e) => handleChange('emergencyContactName', e.target.value)}
        />
        <InputText
          className="flex-1"
          placeholder="Emergency Contact Number"
          value={formData.emergencyContactNumber}
          onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
        />
      </div>

      <div className="text-right pt-6">
        <Button label={mode === 'edit' ? 'Update' : 'Save'} icon="pi pi-check" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SettingsAddNewSupplier;
