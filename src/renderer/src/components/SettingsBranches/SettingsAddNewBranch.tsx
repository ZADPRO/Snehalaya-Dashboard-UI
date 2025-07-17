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
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!formData.refBranchName.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Missing Branch Name', detail: 'Please enter branch name.', life: 3000 });
      return false;
    }
    if (!formData.refBranchCode.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Missing Branch Code', detail: 'Please enter branch code.', life: 3000 });
      return false;
    }
    if (!formData.refLocation.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Missing Location', detail: 'Please enter location.', life: 3000 });
      return false;
    }
    if (!formData.refMobile.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Missing Mobile', detail: 'Please enter mobile number.', life: 3000 });
      return false;
    }
    if (!mobileRegex.test(formData.refMobile.trim())) {
      toast.current?.show({ severity: 'warn', summary: 'Invalid Mobile', detail: 'Mobile number must be exactly 10 digits.', life: 3000 });
      return false;
    }
    if (!formData.refEmail.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Missing Email', detail: 'Please enter email.', life: 3000 });
      return false;
    }
    if (!emailRegex.test(formData.refEmail.trim())) {
      toast.current?.show({ severity: 'warn', summary: 'Invalid Email', detail: 'Invalid email format.', life: 3000 });
      return false;
    }

    const nameExists = existingBranches.some(
      (b) =>
        b.refBranchName.toLowerCase() === formData.refBranchName.trim().toLowerCase() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (nameExists) {
      toast.current?.show({ severity: 'warn', summary: 'Duplicate Name', detail: 'Branch name already exists.', life: 4000 });
      return false;
    }

    const codeExists = existingBranches.some(
      (b) =>
        b.refBranchCode.toLowerCase() === formData.refBranchCode.trim().toLowerCase() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (codeExists) {
      toast.current?.show({ severity: 'warn', summary: 'Duplicate Code', detail: 'Branch code already exists.', life: 4000 });
      return false;
    }

    const mobileExists = existingBranches.some(
      (b) =>
        b.refMobile === formData.refMobile.trim() &&
        (mode === 'add' || b.refBranchId !== editData?.refBranchId)
    );
    if (mobileExists) {
      toast.current?.show({ severity: 'warn', summary: 'Duplicate Mobile', detail: 'Mobile number already exists.', life: 4000 });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    const branch: Branch = {
      refBranchId: editData?.refBranchId ?? Date.now(), // Temporary ID for new items
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
              className="w-full"
            />
            <label htmlFor="refBranchName">Branch Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refBranchCode"
              value={formData.refBranchCode}
              onChange={(e) => handleInputChange('refBranchCode', e.target.value)}
              className="w-full"
            />
            <label htmlFor="refBranchCode">Branch Code</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refLocation"
              value={formData.refLocation}
              onChange={(e) => handleInputChange('refLocation', e.target.value)}
              className="w-full"
            />
            <label htmlFor="refLocation">Location</label>
          </FloatLabel>
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
              className="w-full"
              maxLength={10}
            />
            <label htmlFor="refMobile">Mobile</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="refEmail"
              value={formData.refEmail}
              onChange={(e) => handleInputChange('refEmail', e.target.value)}
              className="w-full"
            />
            <label htmlFor="refEmail">Email</label>
          </FloatLabel>
        </div>

        <div className="flex-1 flex items-center gap-3">
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
