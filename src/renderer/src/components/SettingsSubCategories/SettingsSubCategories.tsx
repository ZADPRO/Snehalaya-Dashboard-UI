import React, { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Sidebar } from 'primereact/sidebar'
import { Toast } from 'primereact/toast'
import { MultiSelect } from 'primereact/multiselect'
import SettingsAddNewSubCategories from './SettingsAddNewSubCategories'
import axios from 'axios'

interface Category {
  refCategoryId: number
  categoryName: string
  categoryCode: string
}

interface SubCategory {
  refSubCategoryId: number
  refCategoryId: number // <- use this name to match API
  subCategoryName: string
  subCategoryCode: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  parentCategoryId?: string
}

const SettingsSubCategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [categoryCodeOptions, setCategoryCodeOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [selectedCategoryCodes, setSelectedCategoryCodes] = useState<string[]>([])
  const [visibleRight, setVisibleRight] = useState(false)
  const [editData, setEditData] = useState<SubCategory | null>(null)
  const [mode, setMode] = useState<'add' | 'edit'>('add')

  const dtRef = useRef<DataTable<SubCategory[]>>(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  // Update category options when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const options = categories.map((category) => ({
        label: category.categoryName,
        value: category.categoryCode
      }))
      setCategoryCodeOptions(options)
    }
  }, [categories])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/settings/categories`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )
      console.log('response', response)
      if (response.status) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/settings/subcategories`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )
      console.log('response', response)
      if (response.status) {
        setSubCategories(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const exportExcel = () => {
    dtRef.current?.exportCSV()
  }

  const activeStatusBody = (rowData: SubCategory) => (
    <Tag
      value={rowData.isActive ? 'Active' : 'Inactive'}
      severity={rowData.isActive ? 'success' : 'danger'}
    />
  )

  const categoryNameBody = (rowData: SubCategory) => {
    const category = categories.find((c) => c.refCategoryId === rowData.refCategoryId)
    return category ? category.categoryName : '-'
  }

  const actionBody = (rowData: SubCategory) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        outlined
        severity="info"
        onClick={() => {
          setEditData(rowData)
          setMode('edit')
          setVisibleRight(true)
        }}
      />
      <Button
        icon="pi pi-trash"
        outlined
        severity="danger"
        onClick={() => handleDelete(rowData.refSubCategoryId)}
      />
    </div>
  )

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/settings/subcategories/${id}`,
        {
          headers: {
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      if (response.data?.status) {
        fetchSubCategories()
        toast.current?.show({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Sub-category deleted successfully',
          life: 2000
        })
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data?.message || 'Unable to delete sub-category',
          life: 3000
        })
      }
    } catch (error) {
      console.error(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete sub-category',
        life: 2000
      })
    }
  }

  const handleSave = async (newSubCategory: SubCategory) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/settings/subcategories`,
        {
          subCategoryName: newSubCategory.subCategoryName,
          subCategoryCode: newSubCategory.subCategoryCode,
          refCategoryId: newSubCategory.parentCategoryId || newSubCategory.refCategoryId,
          isActive: newSubCategory.isActive
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      if (response.data?.status) {
        fetchSubCategories()
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Sub-category created successfully',
          life: 2000
        })
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data?.message || 'Unable to create sub-category',
          life: 3000
        })
      }
    } catch (error) {
      console.error(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create sub-category',
        life: 2000
      })
    }
  }

  const handleUpdate = async (updatedSubCategory: SubCategory) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/settings/subcategories`,
        {
          refSubCategoryId: updatedSubCategory.refSubCategoryId,
          subCategoryName: updatedSubCategory.subCategoryName,
          subCategoryCode: updatedSubCategory.subCategoryCode,
          refCategoryId: updatedSubCategory.parentCategoryId || updatedSubCategory.refCategoryId,
          isActive: updatedSubCategory.isActive
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )

      if (response.data?.status) {
        fetchSubCategories()
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Sub-category updated successfully',
          life: 2000
        })
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data?.message || 'Unable to update sub-category',
          life: 3000
        })
      }
    } catch (error) {
      console.error(error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update sub-category',
        life: 2000
      })
    }
  }

  const leftHeader = (
    <div className="flex gap-2 items-center">
      <Button icon="pi pi-file-excel" severity="success" onClick={exportExcel} />
      <Button
        icon="pi pi-plus"
        onClick={() => {
          setMode('add')
          setEditData(null)
          setVisibleRight(true)
        }}
      />
      <Button icon="pi pi-refresh" severity="secondary" onClick={fetchSubCategories} />
    </div>
  )

  const rightHeader = (
    <div className="flex gap-3 flex-wrap align-items-center">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          placeholder="Search"
          className="w-20rem"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </IconField>

      <MultiSelect
        value={selectedCategoryCodes}
        options={categoryCodeOptions}
        onChange={(e) => setSelectedCategoryCodes(e.value)}
        placeholder="Filter by Category"
        className="w-20rem"
        display="chip"
      />
    </div>
  )

  const filteredSubCategories = subCategories.filter((subCat) => {
    const category = categories.find((cat) => cat.refCategoryId === subCat.refCategoryId)
    const matchesCode =
      selectedCategoryCodes.length === 0 ||
      (category && selectedCategoryCodes.includes(category.categoryCode))
    const matchesSearch =
      globalFilter === '' ||
      subCat.subCategoryName.toLowerCase().includes(globalFilter.toLowerCase()) ||
      subCat.subCategoryCode.toLowerCase().includes(globalFilter.toLowerCase()) ||
      (category && category.categoryName.toLowerCase().includes(globalFilter.toLowerCase()))

    return matchesCode && matchesSearch
  })

  return (
    <div className="card">
      <Toast ref={toast} />

      <Toolbar className="mb-4" left={rightHeader} right={leftHeader} />

      <DataTable
        ref={dtRef}
        value={filteredSubCategories}
        paginator
        rows={10}
        scrollable
        showGridlines
        rowGroupMode="rowspan"
        groupRowsBy="refCategoryId"
        sortField="refCategoryId"
        sortOrder={1}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        emptyMessage="No sub-categories found."
        className="p-datatable-sm"
      >
        <Column header="S.No" body={(_, options) => options.rowIndex + 1} />
        <Column
          field="refCategoryId"
          header="Category"
          body={categoryNameBody}
          style={{ minWidth: '200px' }}
        />
        <Column field="subCategoryName" header="Sub-Category" sortable />
        <Column field="subCategoryCode" header="Code" sortable />
        <Column header="Status" body={activeStatusBody} />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
        <Column header="Actions" body={actionBody} />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => {
          setVisibleRight(false)
          setEditData(null)
          setMode('add')
        }}
        style={{ width: '50vw' }}
      >
        <SettingsAddNewSubCategories
          mode={mode}
          editData={editData}
          categories={categories}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onClose={() => setVisibleRight(false)}
        />
      </Sidebar>
    </div>
  )
}

export default SettingsSubCategories
