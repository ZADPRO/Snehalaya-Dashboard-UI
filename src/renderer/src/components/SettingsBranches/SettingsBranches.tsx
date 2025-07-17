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
import SettingsAddNewBranch from './SettingsAddNewBranch';

interface Branch {
  refBranchId: number;
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  isActive: boolean;
  isDelete: boolean;
  refBTId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const SettingsBranches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [editData, setEditData] = useState<Branch | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const dtRef = useRef<DataTable<Branch[]>>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
        headers: { Authorization: sessionStorage.getItem('token') || '' }
      });
      if (res.data?.status) setBranches(res.data.data);
      else throw new Error(res.data.message);
    } catch (err: any) {
      console.error('Error fetching branches:', err.response);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.response?.data?.message || 'Failed to load branches',
        life: 3000
      });
    }
  };

  const exportExcel = () => dtRef.current?.exportCSV();

  const activeStatusBody = (row: Branch) => (
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

  const actionBody = (row: Branch) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" text onClick={() => { setMode('edit'); setEditData(row); setVisibleSidebar(true); }} />
      <Button icon="pi pi-trash" text severity="danger" onClick={() => handleDelete(row.refBranchId)} />
    </div>
  );

  const handleDelete = async (id: number, forceDelete = false) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/admin/settings/branches/${id}`;
      const params = forceDelete ? { forceDelete: true } : {};

      console.log('Deleting branch:', url, 'with params:', params);

      const response = await axios.delete(url, {
        headers: { Authorization: sessionStorage.getItem('token') || '' },
        params
      });

      if (response.data?.status) {
        fetchData();
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: response.data.message || 'Branch deleted successfully.',
          life: 2000,
        });
      }
    } catch (error: any) {
      const data = error.response?.data;
      console.error('Delete error:', error.response); // Log error response for debugging

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
              detail: 'Delete cancelled.',
              life: 2000,
            });
          },
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: data?.message || 'Failed to delete branch.',
          life: 3000,
        });
      }
    }
  };

const handleSave = async (newBra: Branch) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
      refBranchName: newBra.refBranchName,
      refBranchCode: newBra.refBranchCode,
      refLocation: newBra.refLocation,
      refMobile: newBra.refMobile,
      refEmail: newBra.refEmail,
      isMainBranch: newBra.isMainBranch,
      isActive: newBra.isActive,
      refBTId: newBra.refBTId,
    }, {
      headers: {
        Authorization: sessionStorage.getItem('token') || ''
      }
    });

    if (res.data.status) {
      fetchData();
      setVisibleSidebar(false);
      // toast.current?.show({ severity: 'success', summary: 'Created', detail: res.data.message, life: 2000 });
    } else throw new Error(res.data.message);
  } catch (err: any) {
  //   toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message || 'Error creating branch', life: 3000 });
  // }
  }
};




  const handleUpdate = async (updatedBranch: Branch) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
        refBranchId: updatedBranch.refBranchId,
        refBranchName: updatedBranch.refBranchName,
        refBranchCode: updatedBranch.refBranchCode,
        refLocation: updatedBranch.refLocation,
        refMobile: updatedBranch.refMobile,
        refEmail: updatedBranch.refEmail,
        isMainBranch: updatedBranch.isMainBranch,
        isActive: updatedBranch.isActive,
      }, { headers: { Authorization: sessionStorage.getItem('token') || '' } });

      if (res.data.status) {
        fetchData();
        
        setVisibleSidebar(false);
      } else throw new Error(res.data.message);
    } catch (err: any) {
     
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Toolbar left={leftToolbar} right={rightToolbar} className="mb-4" />
      <DataTable
        ref={dtRef}
        value={branches}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        showGridlines
        scrollable
        sortMode="multiple"
        globalFilter={globalFilter}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        emptyMessage="No branches found."
        className="p-datatable-sm"
      >
        <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
        <Column field="refBranchName" header="Branch Name" sortable />
        <Column field="refBranchCode" header="Branch Code" sortable />
        <Column field="refLocation" header="Location" sortable />
        <Column field="refMobile" header="Mobile" sortable />
        <Column field="refEmail" header="Email" sortable />
        <Column header="Status" body={activeStatusBody} />
        <Column header="Actions" body={actionBody} />
      </DataTable>

      <Sidebar
        visible={visibleSidebar}
        position="right"
        onHide={() => { setVisibleSidebar(false); setEditData(null); setMode('add'); }}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewBranch
          mode={mode}
          editData={editData}
          onClose={() => setVisibleSidebar(false)}
          onSave={handleSave}
          onUpdate={handleUpdate}
        />
      </Sidebar>
    </div>
  );
};

export default SettingsBranches;
