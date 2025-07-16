import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface StatusOption {
  name: string;
  isActive: boolean;
}

interface BranchFormData {
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  selectedStatus: StatusOption | null;
}

export interface Branch {
  refBranchId: number;
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  isActive: boolean;
  refBTId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDelete: boolean;
}

interface SettingsAddNewBranchProps {
  mode: 'add' | 'edit';
  editData?: Branch | null;
  onSave: (newBranch: Branch) => void;
  onUpdate: (updatedBranch: Branch) => void;
  onClose: () => void;
  existingBranches?: Branch[];
}

const SettingsAddNewBranch: React.FC<SettingsAddNewBranchProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose,
  existingBranches = [],
}) => {
  const [formData, setFormData] = useState<BranchFormData>({
    refBranchName: '',
    refBranchCode: '',
    refLocation: '',
    refMobile: '',
    refEmail: '',
    isMainBranch: false,
    selectedStatus: { name: 'Active', isActive: true },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const statusOptions: StatusOption[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false },
  ];

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        refBranchName: editData.refBranchName,
        refBranchCode: editData.refBranchCode,
        refLocation: editData.refLocation,
        refMobile: editData.refMobile,
        refEmail: editData.refEmail,
        isMainBranch: editData.isMainBranch,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive,
        },
      });
    }
  }, [mode, editData]);

  const validateField = (field: keyof BranchFormData, value: any): string => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    switch (field) {
      case 'refBranchName':
        if (!trimmed) return 'Branch Name is required.';
        if (
          existingBranches.some(
            (b) =>
              b.refBranchName.toLowerCase() === trimmed.toLowerCase() &&
              b.refBranchId !== editData?.refBranchId
          )
        ) {
          return 'Branch Name already exists.';
        }
        break;
      case 'refBranchCode':
        if (!trimmed) return 'Branch Code is required.';
        break;
      case 'refLocation':
        if (!trimmed) return 'Location is required.';
        break;
      case 'refMobile':
        if (!trimmed) return 'Mobile number is required.';
        if (!mobileRegex.test(trimmed)) return 'Mobile number must be 10 digits.';
        break;
      case 'refEmail':
        if (!trimmed) return 'Email is required.';
        if (!emailRegex.test(trimmed)) return 'Invalid email format.';
        break;
    }

    return '';
  };

  const handleChange = (
    field: keyof BranchFormData,
    value: string | boolean | StatusOption | null
  ) => {
    if (field === 'refLocation' && typeof value === 'string') {
      value = value.replace(/[^a-zA-Z\s]/g, ''); // allow only alphabets & spaces
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));

    const error = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) return;

    const branch: Branch = {
      refBranchId: editData?.refBranchId ?? Date.now(),
      refBranchName: formData.refBranchName.trim(),
      refBranchCode: formData.refBranchCode.trim(),
      refLocation: formData.refLocation.trim(),
      refMobile: formData.refMobile.trim(),
      refEmail: formData.refEmail.trim(),
      isMainBranch: formData.isMainBranch,
      isActive: formData.selectedStatus?.isActive ?? true,
      refBTId: 1,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
      isDelete: false,
    };

    if (mode === 'add') {
      onSave(branch);
    } else {
      onUpdate(branch);
    }

    setTimeout(() => onClose(), 1000);
  };

  const isSaveDisabled =
    Object.values(errors).some((e) => e) ||
    !formData.refBranchName.trim() ||
    !formData.refBranchCode.trim() ||
    !formData.refLocation.trim() ||
    !formData.refMobile.trim() ||
    !formData.refEmail.trim();

  return (
    <div className="p-4 pb-20 relative">
      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Branch' : 'Edit Branch'}
      </p>

   <div className="flex flex-column gap-3">
  <div className="flex gap-4 align-items-center">
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id="refBranchName"
          value={formData.refBranchName}
          className={`w-full ${errors.refBranchName ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange('refBranchName', e.target.value)}
        />
        <label htmlFor="refBranchName">Branch Name</label>
      </FloatLabel>
      {errors.refBranchName && (
        <small style={{ color: 'red' }}>{errors.refBranchName}</small>
      )}
    </div>

    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id="refBranchCode"
          value={formData.refBranchCode}
          className={`w-full ${errors.refBranchCode ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange('refBranchCode', e.target.value)}
        />
        <label htmlFor="refBranchCode">Branch Code</label>
      </FloatLabel>
      {errors.refBranchCode && (
        <small style={{ color: 'red' }}>{errors.refBranchCode}</small>
      )}
    </div>
  </div>

  <div className="flex gap-4 align-items-center">
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id="refLocation"
          value={formData.refLocation}
          className={`w-full ${errors.refLocation ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange('refLocation', e.target.value)}
        />
        <label htmlFor="refLocation">Location</label>
      </FloatLabel>
      {errors.refLocation && (
        <small style={{ color: 'red' }}>{errors.refLocation}</small>
      )}
    </div>

    <div className="flex-1">
  <FloatLabel className="flex-1 always-float">
    <InputNumber
  id="refMobile"
  value={formData.refMobile ? parseInt(formData.refMobile) : null}
  onValueChange={(e) => handleChange('refMobile', e.value?.toString() || '')}
  useGrouping={false}
  className={`w-full ${errors.refMobile ? 'p-invalid' : ''}`}
  inputStyle={{ width: '100%' }}
  maxLength={10}
/>

    <label htmlFor="refMobile">Mobile</label>
  </FloatLabel>

  {errors.refMobile && (
    <small style={{ color: 'red' }}>{errors.refMobile}</small>
  )}
</div>
  </div>

  <div className="flex gap-4 align-items-center">
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <InputText
          id="refEmail"
          value={formData.refEmail}
          className={`w-full ${errors.refEmail ? 'p-invalid' : ''}`}
          onChange={(e) => handleChange('refEmail', e.target.value)}
        />
        <label htmlFor="refEmail">Email</label>
      </FloatLabel>
      {errors.refEmail && (
        <small style={{ color: 'red' }}>{errors.refEmail}</small>
      )}
    </div>

    <div className="flex-1 flex items-center gap-3">
      <label htmlFor="isMainBranch" className="min-w-[130px]">
        Is Main Branch
      </label>
      <InputSwitch
        id="isMainBranch"
        checked={formData.isMainBranch}
        onChange={(e) => handleChange('isMainBranch', e.value)}
      />
    </div>
  </div>

  <div className="flex gap-4 align-items-center">
    <div className="flex-1">
      <FloatLabel className="flex-1 always-float">
        <Dropdown
          id="status"
          value={formData.selectedStatus}
          onChange={(e: DropdownChangeEvent) => handleChange('selectedStatus', e.value)}
          options={statusOptions}
          optionLabel="name"
          className="w-full"
        />
        <label htmlFor="status">Status</label>
      </FloatLabel>
    </div>
  </div>
</div>


      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          disabled={isSaveDisabled}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewBranch;
