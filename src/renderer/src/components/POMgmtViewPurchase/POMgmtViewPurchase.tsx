import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import './PO.css'
import { Product } from '../../components/POMgmtViewPurchase/Product';
import POMgmtEditPurchase from '@renderer/components/POMgmtViewPurchase/POMgmtEditPurchase';
import POMgmt1 from '@renderer/pages/06-POMgmt/POMgmt1';

const POMgmtViewPurchase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

  const [editStatus, setEditStatus] = useState(false);
  const [activeKey, setActiveKey] = useState<'overview' | 'viewPurchase' | 'editPurchase'>('viewPurchase');
  const [editData, setEditData] = useState<Product | null>(null);

  useEffect(() => {
    setProducts([
      {
        refProductId: 1,
        refPName: 'Laptop',
        refPSKU: 'LTP123',
        refPStatus: true,
        refPBrand: 'Dell',
        refPPrice: 800,
        refPMRP: 1000,
        createdAt: '2025-07-01',
        createdBy: 'Admin',
      },
      {
        refProductId: 2,
        refPName: 'Smartphone',
        refPSKU: 'SPH456',
        refPStatus: false,
        refPBrand: 'Samsung',
        refPPrice: 500,
        refPMRP: 650,
        createdAt: '2025-06-20',
        createdBy: 'Admin',
      },
    ]);
  }, []);

  const statusBody = (row: Product) => (
    <Tag value={row.refPStatus ? 'Active' : 'Inactive'} severity={row.refPStatus ? 'success' : 'danger'} />
  );

  const actionBody = (row: Product) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setEditData(row);
          setActiveKey('editPurchase');
          setEditStatus(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        onClick={() => {
          setProducts(ps => ps.filter(p => p.refProductId !== row.refProductId));
          toast.current?.show({ severity: 'info', summary: 'Deleted', detail: `Removed ${row.refPName}` });
        }}
      />
    </div>
  );
const header = (
  <div className="flex w-full">
    {editStatus && (      
        <POMgmt1
          activeKey={activeKey}
          editData={editData}
          setActiveKey={(key) => {
            setActiveKey(key);
            setEditStatus(key === 'editPurchase');
          }}
        />
     
    )}
    <div className="w-72">
      <IconField iconPosition="left" className="w-full">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          className="w-full"
        />
      </IconField>
    </div>
  </div>
);
  const renderComponent = () => {
    switch (activeKey) {
      case 'editPurchase':
        return (
         <POMgmtEditPurchase
              data={editData}
              onBack={() => setActiveKey('viewPurchase')}
              onSave={(updatedProduct) => {
                setProducts((prev) =>
                  prev.map((p) => (p.refProductId === updatedProduct.refProductId ? updatedProduct : p))
                );
                setActiveKey('viewPurchase');
              }}
            />
        );
      case 'viewPurchase':
      default:
        return (
          <div className="w-full ">
          <DataTable
            value={products}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            globalFilter={globalFilter}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            emptyMessage="No products"
          >
            <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
            <Column field="refPName" header="Name" sortable />
            <Column field="refPSKU" header="SKU" sortable />
            <Column header="Status" body={statusBody} />
            <Column field="refPBrand" header="Brand" sortable />
            <Column field="refPPrice" header="Price" sortable />
            <Column header="Actions" body={actionBody} />
          </DataTable>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar className="mb-4 custom-toolbar" right={header} />

      <div className="flex flex-1 m-3 border-round-md shadow-1 p-4 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default POMgmtViewPurchase;
