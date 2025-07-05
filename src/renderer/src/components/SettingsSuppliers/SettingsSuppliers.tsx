import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import SettingsAddNewSupplier from './SettingsAddNewSupplier';

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

const SettingsSuppliers: React.FC = () => {
  const dtRef = useRef<DataTable<Supplier[]>>(null);
  const toast = useRef<Toast>(null);
  const [visibleRight, setVisibleRight] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const [editData, setEditData] = useState<Supplier | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const exportExcel = () => {
    dtRef.current?.exportCSV();
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/suppliers/read');
      const data = await response.json();
      if (data.status && Array.isArray(data.data)) {
        setSuppliers(data.data);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Fetch Failed',
          detail: data.message || 'Unable to fetch suppliers',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load supplier data',
        life: 3000
      });
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/suppliers/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: data.message || 'Supplier deleted successfully',
          life: 3000
        });
        fetchSuppliers();
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Delete Failed',
          detail: data.message || 'Could not delete supplier',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong while deleting',
        life: 3000
      });
    }
  };

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
      <Button icon="pi pi-refresh" severity="secondary" onClick={fetchSuppliers} />
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

  const actionBody = (rowData: Supplier) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setEditData(rowData);
          setMode('edit');
          setVisibleRight(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData.supplierId)}
      />
    </div>
  );

  return (
    <div>
      <div className="card">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

        <DataTable
          ref={dtRef}
          value={suppliers}
          paginator
          rows={10}
          scrollable
          showGridlines
          globalFilter={globalFilter}
          rowsPerPageOptions={[10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          emptyMessage="No suppliers found."
          className="p-datatable-sm"
        >
          <Column header="S.No" body={(_, options) => options.rowIndex + 1} style={{ minWidth: '2rem' }} frozen />
          <Column field="supplierName" header="Name" frozen sortable style={{ minWidth: '11rem' }} />
          <Column field="supplierCompanyName" header="Company" sortable style={{ minWidth: '10rem' }} />
          <Column field="supplierCode" header="Code" sortable style={{ minWidth: '7rem' }} />
          <Column field="supplierEmail" header="Email" sortable style={{ minWidth: '7rem' }} />
          <Column field="supplierContactNumber" header="Contact No" sortable style={{ minWidth: '10rem' }} />
          <Column field="supplierCity" header="City" sortable style={{ minWidth: '7rem' }} />
          <Column field="supplierCountry" header="Country" sortable style={{ minWidth: '7rem' }} />
          <Column field="supplierGSTNumber" header="GST No." sortable style={{ minWidth: '7rem' }} />
          <Column field="createdBy" header="Created By" style={{ minWidth: '7rem' }} />
          <Column field="createdAt" header="Created At" style={{ minWidth: '12rem' }} />
          <Column header="Actions" body={actionBody} style={{ minWidth: '7rem' }} />
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
          <SettingsAddNewSupplier
            mode={mode}
            editData={editData}
            onClose={() => {
              setVisibleRight(false);
              setEditData(null);
              setMode('add');
              fetchSuppliers();
            }}
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default SettingsSuppliers;
