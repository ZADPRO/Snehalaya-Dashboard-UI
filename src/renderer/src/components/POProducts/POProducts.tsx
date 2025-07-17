import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import parse from 'html-react-parser'

interface Product {
  poName: string
  poDescription: string
  categoryName: string
  poPrice: string
  poDiscPercent: string
  poDisc: string
  dummySKU: string
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const toast = useRef<Toast>(null)

  useEffect(() => {
    const localData = localStorage.getItem('products')
    if (localData) {
      setProducts(JSON.parse(localData))
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'No Products Found',
        detail: 'No products found in localStorage.',
        life: 3000
      })
    }
  }, [])

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
  )

  return (
    <div className="card">
      <Toast ref={toast} pt={{ icon: { className: 'mr-3' } }} />
      <Toolbar className="mb-4" right={leftHeader} />

      <DataTable
        value={products}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        globalFilter={globalFilter}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        showGridlines
        className="p-datatable-sm"
        emptyMessage="No products found"
      >
        <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="dummySKU" header="Initial SKU" sortable />
        <Column field="poName" header="Product Name" sortable />
        <Column
          field="poDescription"
          header="Description"
          sortable
          body={(rowData) => <div>{parse(rowData.poDescription)}</div>}
        />
        <Column field="poPrice" header="Price" sortable />
        <Column field="poDiscPercent" header="Disc %" sortable />
        <Column field="poDisc" header="Disc Amt" sortable />
      </DataTable>
    </div>
  )
}

export default Products
