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

interface Product {
  poId: number;
  poName: string;
  poDescription: string;
  poHSN: string;
  poQuantity: string;
  poPrice: string;
  poDiscPercent: string;
  poDisc: string;
  poTotalPrice: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [visible, setVisible] = useState(false);
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

  const handleUpdateProduct = async (product: Product) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/products/update`,
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
        fetchProducts();
        setVisible(false);
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        showGridlines
        emptyMessage="No products found"
      >
        <Column header="Id" body={(_, { rowIndex }) => rowIndex + 1} />
        {/* <Column field="poName" header="Name" sortable /> */}
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
  {editData && (
    <div className="p-4">
      <h2 className="mb-6 ">Edit Product</h2>

      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label>Product Name</label>
          <InputText
            value={editData.poName}
            onChange={(e) => setEditData({ ...editData, poName: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Description</label>
          <InputText
            value={editData.poDescription}
            onChange={(e) => setEditData({ ...editData, poDescription: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>HSN</label>
          <InputText
            value={editData.poHSN}
            onChange={(e) => setEditData({ ...editData, poHSN: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Quantity</label>
          <InputText
            value={editData.poQuantity}
            onChange={(e) => setEditData({ ...editData, poQuantity: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Price</label>
          <InputText
            value={editData.poPrice}
            onChange={(e) => setEditData({ ...editData, poPrice: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Discount %</label>
          <InputText
            value={editData.poDiscPercent}
            onChange={(e) => setEditData({ ...editData, poDiscPercent: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Discount Amount</label>
          <InputText
            value={editData.poDisc}
            onChange={(e) => setEditData({ ...editData, poDisc: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="field col-12 md:col-6">
          <label>Total Price</label>
          <InputText
            value={editData.poTotalPrice}
            onChange={(e) => setEditData({ ...editData, poTotalPrice: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-right pt-3">
        <Button
          label="Save"
          icon="pi pi-check"
          onClick={() => handleUpdateProduct(editData)}
        />
      </div>
    </div>
  )}
</Sidebar>

    </div>
  );
};

export default Products;
