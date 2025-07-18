import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

interface BranchStatusOption {
  name: string;
  isActive: boolean;
}

export interface Branch {
  refBranchId: number;
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  refBTId: number;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDelete: boolean;
}

interface BranchFormData {
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  selectedStatus: BranchStatusOption | null;
}

interface SettingsAddNewBranchProps {
  mode: 'add' | 'edit';
  editData?: Branch | null;
  onSave: (newBranch: Branch) => void;
  onUpdate: (updatedBranch: Branch) => Promise<void>;
  onClose: () => void;
  existingBranches?: Branch[];
}

const SettingsAddNewBranch: React.FC<SettingsAddNewBranchProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose,
  existingBranches = []
}) => {
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions: BranchStatusOption[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ];

  const [formData, setFormData] = useState<BranchFormData>({
    refBranchName: '',
    refBranchCode: '',
    refLocation: '',
    refMobile: '',
    refEmail: '',
    isMainBranch: false,
    selectedStatus: statusOptions[0]
  });

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        refBranchName: editData.refBranchName,
        refBranchCode: editData.refBranchCode,
        refLocation: editData.refLocation,
        refMobile: editData.refMobile,
        refEmail: editData.refEmail,
        isMainBranch: editData.isMainBranch,
        selectedStatus: editData.isActive ? statusOptions[0] : statusOptions[1]
      });
    }
  }, [mode, editData]);

  const handleInputChange = (
    field: keyof BranchFormData,
    value: string | boolean | BranchStatusOption | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!formData.refBranchName.trim()) newErrors.refBranchName = 'Branch name is required.';
    if (!formData.refBranchCode.trim()) newErrors.refBranchCode = 'Branch code is required.';
    if (!formData.refLocation.trim()) newErrors.refLocation = 'Location is required.';
    if (!formData.refMobile.trim()) newErrors.refMobile = 'Mobile number is required.';
    else if (!mobileRegex.test(formData.refMobile.trim())) newErrors.refMobile = 'Enter a valid 10-digit mobile number.';
    if (!formData.refEmail.trim()) newErrors.refEmail = 'Email is required.';
    else if (!emailRegex.test(formData.refEmail.trim())) newErrors.refEmail = 'Enter a valid email address.';

    // Duplicates
    const nameExists = existingBranches.some(
      (b) =>
        b.refBranchName.toLowerCase() === formData.refBranchName.trim().toLowerCase() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (nameExists) newErrors.refBranchName = 'Branch name already exists.';

    const codeExists = existingBranches.some(
      (b) =>
        b.refBranchCode.toLowerCase() === formData.refBranchCode.trim().toLowerCase() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (codeExists) newErrors.refBranchCode = 'Branch code already exists.';

    const mobileExists = existingBranches.some(
      (b) =>
        b.refMobile === formData.refMobile.trim() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (mobileExists) newErrors.refMobile = 'Mobile number already exists.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    const branch: Branch = {
      refBranchId: editData?.refBranchId ?? Date.now(),
      refBranchName: formData.refBranchName.trim(),
      refBranchCode: formData.refBranchCode.trim(),
      refLocation: formData.refLocation.trim(),
      refMobile: formData.refMobile.trim(),
      refEmail: formData.refEmail.trim(),
      isMainBranch: formData.isMainBranch,
      isActive: formData.selectedStatus?.isActive ?? true,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      refBTId: editData?.refBTId ?? 1,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
      isDelete: false
    };

    if (mode === 'add') {
      onSave(branch);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Branch added successfully.', life: 3000 });
    } else {
      onUpdate(branch);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Branch updated successfully.', life: 3000 });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} />
      <p className="text-xl font-semibold mb-4">{mode === 'add' ? 'Add New Branch' : 'Edit Branch'}</p>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refBranchName"
              value={formData.refBranchName}
              onChange={(e) => handleInputChange('refBranchName', e.target.value)}
              className={`w-full ${errors.refBranchName ? 'p-invalid' : ''}`}
            />
            <label htmlFor="refBranchName">Branch Name</label>
          </FloatLabel>
          {errors.refBranchName && <small className="p-error">{errors.refBranchName}</small>}
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refBranchCode"
              value={formData.refBranchCode}
              onChange={(e) => handleInputChange('refBranchCode', e.target.value)}
              className={`w-full ${errors.refBranchCode ? 'p-invalid' : ''}`}
            />
            <label htmlFor="refBranchCode">Branch Code</label>
          </FloatLabel>
          {errors.refBranchCode && <small className="p-error">{errors.refBranchCode}</small>}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refLocation"
              value={formData.refLocation}
              onChange={(e) => handleInputChange('refLocation', e.target.value)}
              className={`w-full ${errors.refLocation ? 'p-invalid' : ''}`}
            />
            <label htmlFor="refLocation">Location</label>
          </FloatLabel>
          {errors.refLocation && <small className="p-error">{errors.refLocation}</small>}
        </div>

        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refMobile"
              value={formData.refMobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                handleInputChange('refMobile', val);
              }}
              className={`w-full ${errors.refMobile ? 'p-invalid' : ''}`}
              maxLength={10}
            />
            <label htmlFor="refMobile">Mobile</label>
          </FloatLabel>
          {errors.refMobile && <small className="p-error">{errors.refMobile}</small>}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refEmail"
              value={formData.refEmail}
              onChange={(e) => handleInputChange('refEmail', e.target.value)}
              className={`w-full ${errors.refEmail ? 'p-invalid' : ''}`}
            />
            <label htmlFor="refEmail">Email</label>
          </FloatLabel>
          {errors.refEmail && <small className="p-error">{errors.refEmail}</small>}
        </div>

        <div className="flex-1 flex items-center gap-3 mt-2">
          <InputSwitch
            checked={formData.isMainBranch}
            onChange={(e) => handleInputChange('isMainBranch', e.value)}
            inputId="isMainBranch"
          />
          <label htmlFor="isMainBranch" className="select-none">
            Main Branch
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-5 items-center">
        <div className="flex-1">
          <Dropdown
            value={formData.selectedStatus}
            onChange={(e: DropdownChangeEvent) => handleInputChange('selectedStatus', e.value)}
            options={statusOptions}
            optionLabel="name"
            placeholder="Select Status"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          onClick={handleSubmit}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewBranch;
