// ✅ SettingsSuppliers.tsx
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import SettingsAddNewSupplier from './SettingsAddNewSupplier';
// ✅ SettingsSuppliers.tsx
import axios from 'axios'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import SettingsAddNewSupplier from './SettingsAddNewSupplier'

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
  supplierIsActive?: string;
  supplierContactNumber?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  supplierDoorNumber?: string;
  supplierStreet?: string;
  supplierCity?: string;
  supplierState?: string;
  supplierCountry?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
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

  const fetchSuppliers = () => {
    const dummyData: Supplier[] = [
      {
        supplierId: 12,
        supplierName: 'Thiru Kumara Updated',
        supplierCompanyName: 'IT Solutions',
        supplierCode: 'SUP001',
        supplierEmail: 'thiru.updated@example.com',
        supplierGSTNumber: '33AABCT3518Q1ZZ',
        supplierPaymentTerms: 'Net 45',
        supplierBankACNumber: '123456789012',
        supplierIFSC: 'SBIN0001234',
        supplierBankName: 'SBI',
        supplierUPI: 'thiru@upi',
        supplierIsActive: 'true',
        supplierContactNumber: '9876543210',
        emergencyContactName: 'Arun Kumar',
        emergencyContactNumber: '9876543211',
        supplierDoorNumber: '12B',
        supplierStreet: 'MG Road',
        supplierCity: 'Chennai',
        supplierState: 'Tamil Nadu',
        supplierCountry: 'India',
        createdAt: '2025-06-26 17:03:55',
        createdBy: 'Admin',
        updatedAt: '2025-06-26 17:10:30',
        updatedBy: 'Admin',
        isDelete: true
      }
    ];
    setSuppliers(dummyData);
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

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: number) => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Delete Triggered',
      detail: `Supplier with ID ${id} delete requested.`,
      life: 3000
    });
  };

  const handleDelete = async (id: number) => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Delete Triggered',
      detail: `Supplier with ID ${id} delete requested.`,
      life: 3000
    })
  }

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
