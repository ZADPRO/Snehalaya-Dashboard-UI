import axios from 'axios'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'

interface StatusOption {
  name: string
  isActive: boolean
}

interface EmployeeFormData {
  firstName: string
  lastName: string
  designation: string
  roleTypeId: number | null
  refUserStatus: StatusOption | null
  branchId: string
  username: string
  mobile: string
  email: string
  doorNumber: string
  streetName: string
  city: string
  state: string
}

interface RoleTypeProps {
  refRTId: number
  refRTName: string
}

interface BranchTypeProps {
  createdAt: string
  createdBy: string
  isActive: boolean
  isDelete: boolean
  isMainBranch: boolean
  refBTId: number
  refBranchCode: string
  refBranchId: number
  refBranchName: string
  refEmail: string
  refLocation: string
  refMobile: string
  updatedAt: string
  updatedBy: string
}

const SettingsAddEmployees: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [roleType, setRoleType] = useState<RoleTypeProps[] | []>([])
  const [branchDetails, setBranchDetails] = useState<BranchTypeProps[] | []>([])

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    designation: '',
    roleTypeId: null,
    refUserStatus: { name: 'Active', isActive: true },
    branchId: '',
    username: '',
    mobile: '',
    email: '',
    doorNumber: '',
    streetName: '',
    city: '',
    state: ''
  })

  const handleChange = (
    field: keyof EmployeeFormData,
    value: string | boolean | StatusOption | null
  ) => {
    console.log('value', value)
    setFormData((prev) => ({
      ...prev,
      [field]: value as any
    }))
  }

  const statusOptions: StatusOption[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  const getEmployeeRoleType = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/settings/employeeRoleType`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token')
          }
        }
      )
      console.log('\n\nresponse for employee role type', response)
      if (response.status) {
        setRoleType(response.data.roles)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getBranchDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token')
        }
      })
      console.log('\n\nresponse for branch details', response)
      if (response.status) {
        setBranchDetails(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEmployeeRoleType()
    getBranchDetails()
  }, [])
  return (
    <div className="p-1 pb-20 relative">
      <Toast ref={toast} />
      <p className="text-xl font-semibold mb-4">Add New Employee</p>
      <div className="flex flex-column">
        {/* BASIC DETAILS */}
        <div>
          <p className="font-semibold text-lg mb-3">Basic Details</p>
          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="firstName"
                  value={formData.firstName}
                  className="w-full"
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
                <label htmlFor="firstName">First Name</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="lastName"
                  value={formData.lastName}
                  className="w-full"
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
                <label htmlFor="lastName">Last Name</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="designation"
                  value={formData.designation}
                  className="w-full"
                  onChange={(e) => handleChange('designation', e.target.value)}
                />
                <label htmlFor="designation">Designation</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="username"
                  value={formData.username}
                  className="w-full"
                  onChange={(e) => handleChange('username', e.target.value)}
                />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        {/* COMMUNICATION DETAILS */}
        <div>
          <p className="font-semibold text-lg mb-3">Communication Details</p>
          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="email"
                  value={formData.email}
                  className="w-full"
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="mobile"
                  value={formData.mobile}
                  className="w-full"
                  onChange={(e) => handleChange('mobile', e.target.value)}
                />
                <label htmlFor="mobile">Mobile</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="doorNumber"
                  value={formData.doorNumber}
                  className="w-full"
                  onChange={(e) => handleChange('doorNumber', e.target.value)}
                />
                <label htmlFor="doorNumber">Door No</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="streetName"
                  value={formData.streetName}
                  className="w-full"
                  onChange={(e) => handleChange('streetName', e.target.value)}
                />
                <label htmlFor="streetName">Street</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="city"
                  value={formData.city}
                  className="w-full"
                  onChange={(e) => handleChange('city', e.target.value)}
                />
                <label htmlFor="city">City</label>
              </FloatLabel>
            </div>
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="state"
                  value={formData.state}
                  className="w-full"
                  onChange={(e) => handleChange('state', e.target.value)}
                />
                <label htmlFor="state">State</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        {/* CONFIGURATION */}
        <div>
          <p className="font-semibold text-lg mb-3">Configuration</p>
          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <Dropdown
                  id="roleTypeId"
                  value={formData.roleTypeId}
                  onChange={(e: DropdownChangeEvent) => handleChange('roleTypeId', e.value)}
                  options={roleType}
                  optionLabel="refRTName"
                  optionValue="refRTId"
                  placeholder="Select Role Type"
                  className="w-full"
                />
                <label htmlFor="roleTypeId">Role Type</label>
              </FloatLabel>
            </div>

            <div className="flex-1">
              <FloatLabel className="always-float">
                <Dropdown
                  id="refUserStatus"
                  value={formData.refUserStatus}
                  onChange={(e: DropdownChangeEvent) => handleChange('refUserStatus', e.value)}
                  options={statusOptions}
                  optionLabel="name"
                  className="w-full"
                />
                <label htmlFor="refUserStatus">User Status</label>
              </FloatLabel>
            </div>
          </div>

          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <Dropdown
                  id="branchId"
                  value={formData.branchId}
                  onChange={(e: DropdownChangeEvent) => handleChange('branchId', e.value)}
                  options={branchDetails}
                  optionLabel="refBranchName"
                  optionValue="refBranchId"
                  placeholder="Select Branch"
                  className="w-full"
                />
                <label htmlFor="branchId">Branch</label>
              </FloatLabel>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsAddEmployees
