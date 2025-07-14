import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';

import SettingsAddNewCategories from './SettingsAddNewCategories';

interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const SettingsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleRight, setVisibleRight] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const dtRef = useRef<DataTable<Category[]>>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          headers: {
            Authorization: sessionStorage.getItem('token') || ''
          }
        }
      );
      if (response.data?.status) {
        setCategories(response.data.data);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data.message || 'Failed to load categories',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Error fetching categories',
        life: 3000
      });
    }
  };

  const exportExcel = () => {
    dtRef.current?.exportCSV();
  };

  const activeStatusBody = (row: Category) => (
    <Tag
      value={row.isActive ? 'Active' : 'Inactive'}
      severity={row.isActive ? 'success' : 'danger'}
    />
  );

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button
        icon="pi pi-plus"
        onClick={() => {
          setMode('add');
          setEditData(null);
          setVisibleRight(true);
        }}
      />
      <Button icon="pi pi-refresh" severity="secondary" onClick={fetchData} />
    </div>
  );

  const rightHeader = (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        placeholder="Search"
        className="w-25rem"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </IconField>
  );

  const actionBody = (rowData: Category) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        text
        onClick={() => {
          setEditData(rowData);
          setMode('edit');
          setVisibleRight(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        text
        severity="danger"
        onClick={() => handleDelete(rowData.refCategoryId)}
      />
    </div>
  );

 const handleDelete = async (id: number, forceDelete = false) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/admin/settings/categories/${id}`,
      {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
        params: forceDelete ? { forceDelete: true } : {}, 
      }
    );

    const data = response.data;

    if (data.confirmationNeeded) {
      const subList = data.subcategories?.map(
        (s: any) => `• ${s.subCategoryName} (${s.subCategoryCode})`
      ).join('\n') || '';

      confirmDialog({
        message: `${data.message}\n\nSubcategories:\n${subList}\n\nDo you still want to force delete?`,
        header: 'Force Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        accept: () => handleDelete(id, true),
        reject: () => {
          toast.current?.show({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Deletion cancelled.',
            life: 2000,
          });
        },
      });
    } else if (data.status) {
      fetchData();
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: data.message || 'Category deleted successfully',
        life: 2000,
      });
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Failed',
        detail: data.message || 'Could not delete category',
        life: 3000,
      });
    }
  } catch (error: any) {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Unexpected error during deletion',
      life: 3000,
    });
  }
};
1

  const handleSave = async (newCategory: Category) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          categoryName: newCategory.categoryName,
          categoryCode: newCategory.categoryCode,
          isActive: newCategory.isActive
        },
        {
          headers: {
            Authorization: sessionStorage.getItem('token') || ''
          }
        }
      );
      if (response.data.status) {
        fetchData();
        toast.current?.show({
          severity: 'success',
          summary: 'Created',
          detail: response.data.message || 'Category created successfully',
          life: 2000
        });
        setVisibleRight(false);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Creation Failed',
          detail: response.data.message,
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Error creating category',
        life: 3000
      });
    }
  };

  const handleUpdate = async (updatedCategory: Category) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          refCategoryId: updatedCategory.refCategoryId,
          categoryName: updatedCategory.categoryName,
          categoryCode: updatedCategory.categoryCode,
          isActive: updatedCategory.isActive
        },
        {
          headers: {
            Authorization: sessionStorage.getItem('token') || ''
          }
        }
      );
      if (response.data.status) {
        fetchData();
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: response.data.message || 'Category updated successfully',
          life: 2000
        });
        setVisibleRight(false);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Update Failed',
          detail: response.data.message,
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Error updating category',
        life: 3000
      });
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

      <DataTable
        ref={dtRef}
        value={categories}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        showGridlines
        scrollable
        sortMode="multiple"
        globalFilter={globalFilter}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        emptyMessage="No categories found."
        className="p-datatable-sm"
      >
        <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
        <Column field="categoryName" header="Category Name" sortable />
        <Column field="categoryCode" header="Category Code" sortable />
        <Column header="Status" body={activeStatusBody} />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
        <Column header="Actions" body={actionBody} />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => {
          setVisibleRight(false);
          setEditData(null);
          setMode('add');
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewCategories
          mode={mode}
          editData={editData}
          onClose={() => setVisibleRight(false)}
          onSave={handleSave}
          onUpdate={handleUpdate}
        />
      </Sidebar>
    </div>
  );
};

export default SettingsCategories;
