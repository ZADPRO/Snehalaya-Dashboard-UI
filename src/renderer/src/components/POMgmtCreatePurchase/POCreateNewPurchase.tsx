import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import axios from 'axios'
import { Divider } from 'primereact/divider'

interface Supplier {
  supplierId: number
  supplierCompanyName: string
  supplierCode: string
  supplierEmail: string
  supplierContactNumber: string
  supplierDoorNumber: string
  supplierStreet: string
  supplierCity: string
  supplierState: string
  supplierCountry: string
}

interface Branch {
  refBranchId: number
  refBranchName: string
  refBranchCode: string
  refLocation: string
  refMobile: string
  refEmail: string
}

const POCreateNewPurchase: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [creditedDays, setCreditedDays] = useState<number>(0)
  const [creditedDate, setCreditedDate] = useState<Date | null>(null)

  const [transport, setTransport] = useState<string>('')

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    axios
      .get('http://localhost:8080/api/v1/admin/suppliers/read', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setSuppliers(res.data.data))

    axios
      .get('http://localhost:8080/api/v1/admin/settings/branches', {
        headers: { Authorization: `${token}` }
      })
      .then((res) => setBranches(res.data.data))
  }, [])

  useEffect(() => {
    const currentDate = new Date()
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + creditedDays)
    setCreditedDate(newDate)
  }, [creditedDays])

  return (
    <div className="purchaseOrderCreationCard flex" style={{ width: '100%', height: '100%' }}>
      {/* Left Section - Form */}
      <div className="creationCard" style={{ width: '80%' }}>
        <div className="flex">
          <div className="flex flex-column gap-4 p-4" style={{ width: '30%' }}>
            {/* Float Label Input Fields */}
            <span className="p-float-label always-float">
              <Dropdown
                id="supplier"
                value={selectedSupplier}
                options={suppliers}
                onChange={(e) => setSelectedSupplier(e.value)}
                optionLabel="supplierCompanyName"
                className="w-full"
              />
              <label htmlFor="supplier">Supplier</label>
            </span>

            <span className="p-float-label always-float">
              <InputNumber
                id="creditedDays"
                value={creditedDays}
                onValueChange={(e) => setCreditedDays(e.value ?? 0)}
                useGrouping={false}
                className="w-full"
              />
              <label htmlFor="creditedDays">Credited Days</label>
            </span>

            <span className="p-float-label always-float">
              <Calendar
                id="creditedDate"
                value={creditedDate}
                onChange={(e) => setCreditedDate(e.value as Date)}
                className="w-full"
                dateFormat="dd-mm-yy"
              />
              <label htmlFor="creditedDate">Expected Date</label>
            </span>

            <span className="p-float-label always-float">
              <InputText
                id="transport"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full"
              />
              <label htmlFor="transport">Transport</label>
            </span>

            <span className="p-float-label always-float">
              <Dropdown
                id="branch"
                value={selectedBranch}
                options={branches}
                onChange={(e) => setSelectedBranch(e.value)}
                optionLabel="refBranchName"
                className="w-full"
              />
              <label htmlFor="branch">Branch</label>
            </span>
          </div>

          <Divider layout="vertical" />

          {/* Right Section - Preview */}
          <div className="flex flex-column gap-3 p-4 border-gray-300" style={{ width: '70%' }}>
            <h4>Preview</h4>

            <div className="flex justify-content-between">
              {selectedSupplier && (
                <div className="mb-3">
                  <strong>Dispatched From (Supplier):</strong>
                  <p>
                    <strong>{selectedSupplier.supplierCompanyName}</strong> (
                    {selectedSupplier.supplierCode})
                  </p>
                  <p>
                    {selectedSupplier.supplierDoorNumber}, {selectedSupplier.supplierStreet},
                  </p>
                  <p>
                    {selectedSupplier.supplierCity}, {selectedSupplier.supplierState},{' '}
                    {selectedSupplier.supplierCountry}
                  </p>
                  <p>Email: {selectedSupplier.supplierEmail}</p>
                  <p>Mobile: {selectedSupplier.supplierContactNumber}</p>
                </div>
              )}

              {selectedBranch && (
                <div className="mb-3">
                  <strong>Dispatched To (Branch):</strong>
                  <p>
                    <strong>{selectedBranch.refBranchName}</strong> ({selectedBranch.refBranchCode})
                  </p>
                  <p>{selectedBranch.refLocation}</p>
                  <p>Email: {selectedBranch.refEmail}</p>
                  <p>Mobile: {selectedBranch.refMobile}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {creditedDate && (
                <div className="flex gap-2">
                  <strong>Expected Date:</strong>
                  <p>{creditedDate.toLocaleDateString()}</p>
                </div>
              )}

              {transport && (
                <div className="flex gap-2">
                  <strong>Transport:</strong>
                  <p>{transport}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="addProductsPreview">
          
        </div>
      </div>

      <Divider layout="vertical" />
      {/* Right Sidebar Buttons */}
      <div className="creationCard" style={{ width: '20%' }}>
        <div className="buttons p-3 flex flex-column gap-2">
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{
              border: '1px solid #8e5ea8'
            }}
          >
            Print Order
          </p>
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{
              border: '1px solid #8e5ea8'
            }}
          >
            Create Invoice
          </p>
          <p
            className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
            style={{
              border: '1px solid #8e5ea8'
            }}
          >
            Download
          </p>
        </div>
      </div>
    </div>
  )
}

export default POCreateNewPurchase
