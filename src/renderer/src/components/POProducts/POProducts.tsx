import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import axios from 'axios';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import AddNewProduct, { Product } from './../POCreateProducts/POCreateProducts';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editData, setEditData] = useState<Product | null>(null);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products/read`, {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
      });

      if (response.data.status) {
        setProducts(response.data.data);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data.message || 'Failed to load products',
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'API call failed',
        life: 3000,
      });
    }
  };

  // Update API call
  const handleUpdateProduct = async (product: Product) => {
    try {
      const response = await axios.put(
        'http://localhost:8080/api/v1/admin/products/update',
        product,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token') || '',
          },
        }
      );

      if (response.data.status) {
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Product updated successfully',
          life: 2000,
        });
        fetchProducts(); // Refresh the list after update
        setVisible(false); // Close the modal
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update product',
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'API error during update',
        life: 3000,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/products/delete/${id}`, {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: `Product with ID ${id} deleted`,
        life: 2000,
      });

      fetchProducts();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete product',
        life: 3000,
      });
    }
  };

  const actionBody = (rowData: Product) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setEditData(rowData);
          setMode('edit');
          setVisible(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData.poId)}
      />
    </div>
  );

  const leftHeader = (
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

  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar className="mb-4" right={leftHeader} />
      <DataTable
        value={products}
        paginator
        rows={10}
        globalFilter={globalFilter}
        showGridlines
        emptyMessage="No products found"
      >
        <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="poName" header="Name" sortable />
        <Column field="poDescription" header="Description" sortable />
        <Column field="poHSN" header="HSN" sortable />
        <Column field="poQuantity" header="Qty" sortable />
        <Column field="poPrice" header="Price" sortable />
        <Column field="poDiscPercent" header="Disc %" sortable />
        <Column field="poDisc" header="Disc Amt" sortable />
        <Column field="poTotalPrice" header="Total" sortable />
        <Column header="Actions" body={actionBody} />
      </DataTable>

      <Sidebar
        visible={visible}
        position="right"
        onHide={() => setVisible(false)}
        style={{ width: '40vw' }}
      >
        <AddNewProduct
          mode={mode}
          editData={editData}
          onClose={() => setVisible(false)}
          onSave={handleUpdateProduct} // Use the handleUpdateProduct for update
        />
      </Sidebar>
    </div>
  );
};

export default Products;
