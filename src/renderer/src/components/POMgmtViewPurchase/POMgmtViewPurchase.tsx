import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import { BreadCrumb } from 'primereact/breadcrumb';

interface Product {
  refProductId: number;
  refPName: string;
  refPSKU: string;
  refPStatus: boolean;
  refPType: string;
  refGtIn: string;
  refSize: number;
  rePPriceCode: string;
  refPBrand: string;
  refPCategoryId: number;
  refSubCategoryId: number;
  refPTaxClass: string;
  refPUnits: string;
  refPPrice: string;
  refPMRP: string;
  refPCost: string;
  refPFeatured: boolean;
  refPPublishState: string;
  refPShortDescription: string;
  refPLongDescription: string;
  refProductImages: string;
  refPurchaseAccount: string;
  refSalesAccount: string;
  availableStores: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const POMgmtViewPurchase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [mode, setMode] = useState<'view' | 'add'>('view');
  const toast = useRef<Toast>(null);
  const dtRef = useRef<DataTable<Product[]>>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const mockProducts: Product[] = [
      {
        refProductId: 1,
        refPName: 'Product 1',
        refPSKU: 'SKU123',
        refPStatus: true,
        refPType: 'Type A',
        refGtIn: 'GTIN123',
        refSize: 10,
        rePPriceCode: 'PC001',
        refPBrand: 'Brand X',
        refPCategoryId: 101,
        refSubCategoryId: 201,
        refPTaxClass: 'GST18',
        refPUnits: 'pcs',
        refPPrice: '100',
        refPMRP: '120',
        refPCost: '80',
        refPFeatured: true,
        refPPublishState: 'Published',
        refPShortDescription: 'Short desc',
        refPLongDescription: 'Long description here',
        refProductImages: 'img1.jpg',
        refPurchaseAccount: 'PA001',
        refSalesAccount: 'SA001',
        availableStores: 5,
        createdAt: '2024-01-01',
        createdBy: 'Admin',
        updatedAt: '2024-06-01',
        updatedBy: 'Editor'
      }
    ];
    setProducts(mockProducts);
  };

  const exportExcel = () => {
    dtRef.current?.exportCSV();
  };

  const statusBodyTemplate = (rowData: Product) => (
    <Tag value={rowData.refPStatus ? 'Active' : 'Inactive'} severity={rowData.refPStatus ? 'success' : 'danger'} />
  );

  const breadcrumbItems = [
    {
      label: 'Purchase Order',
      command: () => {
        setProducts([]); // Clear data for this view
      }
    },
    {
      label: 'Add Products',
      command: () => {
        setProducts([]); // Clear data for this view
      }
    }
  ];

  const homeItem = {
    icon: 'pi pi-home',
    command: () => {
      fetchData(); // Reset to default mock data
    }
  };

  const rightHeader = (
    <div className="flex flex-column md:flex-row md:items-center gap-2">
      {mode === 'add' ? (
        <BreadCrumb model={breadcrumbItems} home={homeItem} />
      ) : (
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            placeholder="Search"
            className="w-25rem"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </IconField>
      )}
    </div>
  );

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      {mode !== 'add' && (
        <Button
          icon="pi pi-plus"
          onClick={() => {
            setMode('add');
          }}
        />
      )}
      <Button icon="pi pi-refresh" severity="secondary" onClick={fetchData} />
    </div>
  );

  const actionBody = (rowData: Product) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text severity="info" />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(rowData.refProductId)} />
    </div>
  );

  const handleDelete = async (id: number) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Deleted',
      detail: `Product with ID ${id} deleted `
    });
    fetchData();
  };

  return (
    <div className="card">
      <Toast ref={toast} />

      <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

      <DataTable
        ref={dtRef}
        value={products}
        paginator
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        scrollable
        globalFilter={globalFilter}
        showGridlines
        sortMode="multiple"
        emptyMessage="No products found."
      >
        <Column header="S.No" body={(_rowData, options) => options.rowIndex + 1} />
        <Column field="refPName" header="Name" sortable />
        <Column field="refPSKU" header="SKU" sortable />
        <Column header="Status" body={statusBodyTemplate} />
        <Column field="refPBrand" header="Brand" sortable />
        <Column field="refPPrice" header="Price" sortable />
        <Column field="refPMRP" header="MRP" sortable />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
        <Column header="Actions" body={actionBody} />
      </DataTable>
    </div>
  );
};

export default POMgmtViewPurchase;
