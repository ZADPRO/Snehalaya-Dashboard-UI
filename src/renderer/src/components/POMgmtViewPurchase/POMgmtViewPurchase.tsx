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
import { Product } from '../../components/POMgmtViewPurchase/Product';

interface Props {
  onEditProduct: (product: Product) => void;
}

const POMgmtViewPurchase: React.FC<Props> = ({ onEditProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);

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
        createdBy: 'Admin'
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
        createdBy: 'Admin'
      }
    ]);
  }, []);

  const statusBody = (row: Product) =>
    <Tag value={row.refPStatus ? 'Active' : 'Inactive'}
         severity={row.refPStatus ? 'success' : 'danger'} />;
  
   const actionBody = (row: Product) => (
     <div className="flex gap-2">
       <Button
         icon="pi pi-pencil"
         rounded
         text
         severity="info"
         onClick={() => {
           if (typeof onEditProduct === 'function') {
             onEditProduct(row);
           } else {
             console.error('onEditProduct is not a function');
           }
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
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} placeholder="Search" />
    </IconField>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar className="mb-4" right={header} />
      <DataTable
        value={products}
        paginator
        rows={5}
        globalFilter={globalFilter}
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
};

export default POMgmtViewPurchase;
