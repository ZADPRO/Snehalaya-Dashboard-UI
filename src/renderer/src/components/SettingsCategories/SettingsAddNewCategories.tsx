import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface CategoryStatusOptions {
  name: string;
  isActive: boolean;
}

export interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  profitMargin?: number;
}

interface CategoryFormData {
  categoryName: string;
  categoryCode: string;
  selectedStatus: CategoryStatusOptions | null;
  profitMargin: string;
}

interface SettingsAddNewCategoriesProps {
  mode: 'add' | 'edit';
  editData?: Category | null;
  onSave: (newCategory: Category) => void;
  onUpdate: (updatedCategory: Category) => void;
  onClose: () => void;
}

const SettingsAddNewCategories: React.FC<SettingsAddNewCategoriesProps> = ({
  mode,
  editData,
  onSave,
  onUpdate,
  onClose
}) => {
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryCode: '',
    selectedStatus: { name: 'Active', isActive: true },
    profitMargin: ''
  });

  const statusOptions: CategoryStatusOptions[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ];

  useEffect(() => {
    if (mode === 'edit' && editData) {
      setFormData({
        categoryName: editData.categoryName,
        categoryCode: editData.categoryCode,
        selectedStatus: {
          name: editData.isActive ? 'Active' : 'In Active',
          isActive: editData.isActive
        },
        profitMargin: editData.profitMargin?.toString() || ''
      });
    }
  }, [mode, editData]);

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | CategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.categoryName.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Name',
        detail: 'Please enter a category name.',
        life: 3000
      });
      return false;
    }
    if (!formData.categoryCode.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Missing Code',
        detail: 'Please enter a category code.',
        life: 3000
      });
      return false;
    }
    if (formData.profitMargin.trim() === '' || isNaN(Number(formData.profitMargin))) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Invalid Profit Margin',
        detail: 'Please enter a valid profit margin.',
        life: 3000
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);

    const category: Category = {
      refCategoryId: editData?.refCategoryId ?? 0,
      categoryName: formData.categoryName.trim(),
      categoryCode: formData.categoryCode.trim(),
      isActive: formData.selectedStatus?.isActive ?? true,
      createdAt: editData?.createdAt ?? new Date().toISOString(),
      createdBy: 'Admin',
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin',
      profitMargin: parseFloat(formData.profitMargin)
    };

    try {
      const url = `${import.meta.env.VITE_API_URL}/admin/settings/categories`;
      const headers = { Authorization: sessionStorage.getItem('token') || '' };

      if (mode === 'add') {
        const response = await axios.post(url, category, { headers });
        toast.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: response.data.message || 'Category added successfully!',
          life: 3000
        });
        onSave(response.data);
      } else {
        const response = await axios.put(url, category, { headers });
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: response.data.message || 'Category updated successfully!',
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
            detail: 'Category code already exists. Use a different code.',
            life: 4000
          });
        } else if (msg?.includes('name')) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Duplicate Name',
            detail: 'Category name already exists. Use a different name.',
            life: 4000
          });
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Duplicate Entry',
            detail: 'Category already exists.',
            life: 4000
          });
        }
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save category.',
          life: 3000
        });
      }
    }
  };

  return (
    <div className="p-4 pb-20 relative">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <p className="text-xl font-semibold mb-4">
        {mode === 'add' ? 'Add New Category' : 'Edit Category'}
      </p>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="categoryName"
              value={formData.categoryName}
              className="w-full"
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
            />
            <label htmlFor="categoryName">Category Name</label>
          </FloatLabel>
        </div>
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="categoryCode"
              value={formData.categoryCode}
              className="w-full"
              onChange={(e) => handleInputChange('categoryCode', e.target.value)}
            />
            <label htmlFor="categoryCode">Category Code</label>
          </FloatLabel>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <div className="flex-1">
          <FloatLabel className="always-float">
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

        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="profitMargin"
              keyfilter="num"
              value={formData.profitMargin}
              className="w-full"
              onChange={(e) => handleInputChange('profitMargin', e.target.value)}
            />
            <label htmlFor="profitMargin">Profit Margin (%)</label>
          </FloatLabel>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label={mode === 'add' ? 'Save' : 'Update'}
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SettingsAddNewCategories;
