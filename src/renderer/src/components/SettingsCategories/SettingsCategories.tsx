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
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const dtRef = useRef<DataTable<Category[]>>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/categories`, {
        headers: { Authorization: sessionStorage.getItem('token') || '' }
      });
      if (res.data?.status) setCategories(res.data.data);
      else throw new Error(res.data.message);
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load categories',
        life: 3000
      });
    }
  };

  const exportExcel = () => dtRef.current?.exportCSV();

  const activeStatusBody = (row: Category) => (
    <Tag value={row.isActive ? 'Active' : 'Inactive'} severity={row.isActive ? 'success' : 'danger'} />
  );

  const leftToolbar = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button icon="pi pi-plus" onClick={() => { setMode('add'); setEditData(null); setVisibleSidebar(true); }} />
      <Button icon="pi pi-refresh" severity="secondary" onClick={fetchData} />
    </div>
  );

  const rightToolbar = (
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

  const actionBody = (row: Category) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text onClick={() => { setMode('edit'); setEditData(row); setVisibleSidebar(true); }} />
      <Button icon="pi pi-trash" text severity="danger" onClick={() => handleDelete(row.refCategoryId)} />
    </div>
  );

  const handleDelete = async (id: number, forceDelete = false) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/admin/settings/categories/${id}`;
      const params = forceDelete ? { forceDelete: true } : {};

      console.log('Deleting:', url, 'with params:', params);

      const response = await axios.delete(url, {
        headers: { Authorization: sessionStorage.getItem('token') || '' },
        params
      });

      if (response.data?.status) {
        fetchData();
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: response.data.message || 'Category deleted successfully.',
          life: 2000,
        });
      }
    } catch (error: any) {
      const data = error.response?.data;
      console.error('Delete error:', error.response);

      if (error.response?.status === 409 && data?.confirmationNeeded) {
        

        confirmDialog({
          message: `${data.message}\n\nDo you want to delete?`,
          header: 'Delete Confirmation',
         
          acceptLabel: 'Yes, Delete',
          rejectLabel: 'Cancel',
          acceptClassName: 'p-button-danger',
          accept: () => handleDelete(id, true),
          reject: () => {
            toast.current?.show({
              severity: 'info',
              summary: 'Cancelled',
              detail: 'delete cancelled.',
              life: 2000,
            });
          },
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: data?.message || 'Failed to delete category.',
          life: 3000,
        });
      }
    }
  };

  const handleSave = async (newCat: Category) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/settings/categories`, {
        categoryName: newCat.categoryName,
        categoryCode: newCat.categoryCode,
        isActive: newCat.isActive
      }, { headers: { Authorization: sessionStorage.getItem('token') || '' } });

      if (res.data.status) {
        fetchData();
        // toast.current?.show({ severity: 'success', summary: 'Created', detail: res.data.message, life: 2000 });
        setVisibleSidebar(false);
      } else throw new Error(res.data.message);
    } catch (err: any) {
      console.log(err)
      // toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message || 'Error creating category', life: 3000 });
    }
  };

  const handleUpdate = async (updCat: Category) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/settings/categories`, {
        refCategoryId: updCat.refCategoryId,
        categoryName: updCat.categoryName,
        categoryCode: updCat.categoryCode,
        isActive: updCat.isActive
      }, { headers: { Authorization: sessionStorage.getItem('token') || '' } });

      if (res.data.status) {
        fetchData();
        
        setVisibleSidebar(false);
      } else throw new Error(res.data.message);
    } catch (err) {
        console.log(err)
     
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Toolbar left={leftToolbar} right={rightToolbar} className="mb-4" />

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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
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
        visible={visibleSidebar}
        position="right"
        onHide={() => { setVisibleSidebar(false); setEditData(null); setMode('add'); }}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewCategories
          mode={mode}
          editData={editData}
          onClose={() => setVisibleSidebar(false)}
          onSave={handleSave}
          onUpdate={handleUpdate}
           existingCategories={categories}
        />
      </Sidebar>
    </div>
  );
};

export default SettingsCategories;
