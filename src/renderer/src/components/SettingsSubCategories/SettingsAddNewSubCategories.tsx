import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface SubCategoryStatusOptions {
  name: string;
  isActive: boolean;
}

export interface SubCategory {
  refSubCategoryId: number;
  refCategoryId: number;
  subCategoryName: string;
  subCategoryCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

interface Category {
  refCategoryId: number;
  categoryName: string;
}

interface SubCategoryFormData {
  parentCategory: Category | null;
  subCategoryName: string;
  subCategoryCode: string;
  selectedStatus: SubCategoryStatusOptions | null;
}

interface Props {
  mode: 'add' | 'edit';
  editData?: SubCategory | null;
  categories: Category[];
  onSave: (newSubCategory: SubCategory) => void;
  onUpdate: (updatedSubCategory: SubCategory) => void;
  onClose: () => void;
}

const SettingsAddNewSubCategories: React.FC<Props> = ({
  mode,
  editData,
  categories,
  onSave,
  onUpdate,
  onClose
}) => {
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SubCategoryFormData>({
    parentCategory: null,
    subCategoryName: '',
    subCategoryCode: '',
    selectedStatus: { name: 'Active', isActive: true }
  });

  const statusOptions: SubCategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ];

  useEffect(() => {
    if (mode === 'edit' && editData) {
      const categoryMatch = categories.find(
        (c) => c.refCategoryId === editData.refCategoryId
      );
      setFormData({
        parentCategory: categoryMatch || null,
        subCategoryName: editData.subCategoryName,
        subCategoryCode: editData.subCategoryCode,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive
        }
      });
    }
  }, [mode, editData, categories]);

  const handleInputChange = (
    field: keyof SubCategoryFormData,
    value: string | Category | SubCategoryStatusOptions | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.parentCategory) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Category',
        detail: 'Please select a parent category.',
        life: 3000
      });
      return false;
    }
    if (!formData.subCategoryName.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Name',
        detail: 'Please enter a sub-category name.',
        life: 3000
      });
      return false;
    }
    if (!formData.subCategoryCode.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Code',
        detail: 'Please enter a sub-category code.',
        life: 3000
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);

    const subCategory: SubCategory = {
      refSubCategoryId: editData?.refSubCategoryId ?? 0,
      refCategoryId: formData.parentCategory?.refCategoryId ?? 0,
      subCategoryName: formData.subCategoryName.trim(),
      subCategoryCode: formData.subCategoryCode.trim(),
      isActive: formData.selectedStatus?.isActive ?? true,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin'
    };

    try {
      const url = `${import.meta.env.VITE_API_URL}/admin/settings/subcategories`;
      const headers = {
        Authorization: sessionStorage.getItem('token')
      };

      if (mode === 'add') {
        const response = await axios.post(url, subCategory, { headers });
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: response.data.message || 'Sub-category added successfully!',
          life: 3000
        });
        onSave(response.data);
      } else {
        const response = await axios.put(url, subCategory, { headers });
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: response.data.message || 'Sub-category updated successfully!',
          life: 3000
        });
        onUpdate(response.data);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (error: any) {
      setIsSubmitting(false);
      const msg = error?.response?.data?.message?.toLowerCase();

      if (error.response?.status === 409) {
        if (msg?.includes('code')) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Duplicate Code',
            detail: 'Sub-category code already exists. Use a different code.',
            life: 4000
          });
        } else if (msg?.includes('name')) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Duplicate Name',
            detail: 'Sub-category name already exists. Use a different name.',
            life: 4000
          });
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Duplicate Entry',
            detail: 'Sub-category already exists.',
            life: 4000
          });
        }
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save sub-category.',
          life: 3000
        });
      }
    }
  };

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />

      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Sub-Category' : 'Edit Sub-Category'}
      </p>

      <div className="flex flex-row gap-4">
        <div className="flex-1 gap-3">
          <FloatLabel className="flex-1 always-float">
            <Dropdown
              id="parentCategory"
              value={formData.parentCategory}
              onChange={(e) => handleInputChange('parentCategory', e.value)}
              options={categories}
              optionLabel="categoryName"
              placeholder="Select Category"
              className="w-full"
            />
            <label htmlFor="parentCategory">Parent Category</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel className="flex-1 always-float">
            <InputText
              id="subCategoryName"
              value={formData.subCategoryName}
              className="w-full"
              onChange={(e) =>
                handleInputChange('subCategoryName', e.target.value)
              }
            />
            <label htmlFor="subCategoryName">Sub-Category Name</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-4">
        <div className="flex-1">
          <FloatLabel className="flex-1 always-float">
            <InputText
              id="subCategoryCode"
              value={formData.subCategoryCode}
              className="w-full"
              onChange={(e) =>
                handleInputChange('subCategoryCode', e.target.value)
              }
            />
            <label htmlFor="subCategoryCode">Sub-Category Code</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel className="flex-1 always-float">
            <Dropdown
              id="status"
              value={formData.selectedStatus}
              onChange={(e: DropdownChangeEvent) =>
                handleInputChange('selectedStatus', e.value)
              }
              options={statusOptions}
              optionLabel="name"
              className="w-full"
            />
            <label htmlFor="status">Status</label>
          </FloatLabel>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewSubCategories;
