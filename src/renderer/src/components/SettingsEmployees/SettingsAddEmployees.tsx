import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { Button } from 'primereact/button'
import { State, City } from 'country-state-city'

import {
  BranchTypeProps,
  CityType,
  EmployeeFormData,
  RoleTypeProps,
  StateType,
  StatusOption
} from './SettingsAddEmployees.types'
import { getEmployeeRoleType, getBranchDetails } from './SettingsAddEmployees.api'

const SettingsAddEmployees: React.FC = () => {
  const toast = useRef<Toast>(null)

  const [roleType, setRoleType] = useState<RoleTypeProps[]>([])
  const [branchDetails, setBranchDetails] = useState<BranchTypeProps[]>([])
  const [states, setStates] = useState<StateType[]>([])
  const [cities, setCities] = useState<CityType[]>([])

  const [errors, setErrors] = useState<{ email?: string; mobile?: string }>({})

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
    state: 'Tamil Nadu'
  })

  const statusOptions: StatusOption[] = [
    { name: 'Active', isActive: true },
    { name: 'In Active', isActive: false }
  ]

  const handleChange = (
    field: keyof EmployeeFormData,
    value: string | number | StatusOption | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any
    }))

    // Perform validations
    if (field === 'email') {
      const error = validateEmail(value as string)
      setErrors((prev) => ({ ...prev, email: error }))
    }

    if (field === 'mobile') {
      const error = validateMobile(value as string)
      setErrors((prev) => ({ ...prev, mobile: error }))
    }

    if (field === 'state' && typeof value === 'string') {
      const selectedState = states.find((s) => s.name === value)
      if (selectedState) {
        const stateCities = City.getCitiesOfState('IN', selectedState.isoCode)
        setCities(stateCities)
      }
    }
  }

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) return 'Email is required'
    if (!emailRegex.test(email)) return 'Enter a valid email address'
    return undefined
  }

  const validateMobile = (mobile: string): string | undefined => {
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobile.trim()) return 'Mobile number is required'
    if (!mobileRegex.test(mobile)) return 'Enter a valid 10-digit mobile number'
    return undefined
  }

  const isFormValid = (): boolean => {
    const f = formData
    return (
      f.firstName.trim() !== '' &&
      f.lastName.trim() !== '' &&
      f.designation.trim() !== '' &&
      f.username.trim() !== '' &&
      f.email.trim() !== '' &&
      f.mobile.trim() !== '' &&
      f.doorNumber.trim() !== '' &&
      f.streetName.trim() !== '' &&
      f.city.trim() !== '' &&
      f.state.trim() !== '' &&
      f.roleTypeId !== null &&
      f.refUserStatus !== null &&
      f.branchId !== ''
    )
  }

  const handleSubmit = () => {
    console.log('Submitted Payload:', {
      ...formData,
      refUserStatus: formData.refUserStatus?.isActive
    })
    toast.current?.show({ severity: 'success', summary: 'Submitted', detail: 'Employee added.' })
  }

  useEffect(() => {
    getEmployeeRoleType().then(setRoleType).catch(console.log)
    getBranchDetails().then(setBranchDetails).catch(console.log)

    const indianStates = State.getStatesOfCountry('IN')
    setStates(indianStates)

    const defaultState = indianStates.find((s) => s.name === 'Tamil Nadu')
    if (defaultState) {
      const cities = City.getCitiesOfState('IN', defaultState.isoCode)
      setCities(cities)
    }
  }, [])

  return (
    <div className="p-1 pb-20 relative">
      <Toast ref={toast} />
      <p className="text-xl font-bold mb-4 uppercase">Add New Employee</p>
      <div className="flex flex-column">
        {/* BASIC DETAILS */}
        <div>
          <p className="font-semibold text-lg mb-3 underline uppercase">Basic Details</p>
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
                  id="username"
                  value={formData.username}
                  className="w-full"
                  onChange={(e) => handleChange('username', e.target.value)}
                />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
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
          </div>
        </div>

        {/* COMMUNICATION DETAILS */}
        <div>
          <p className="font-semibold text-lg mb-3 underline uppercase">Communication Details</p>
          <div className="flex gap-4 align-items-center mb-3">
            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="email"
                  value={formData.email}
                  className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </FloatLabel>
              {errors.email && (
                <small id="email-help" className="p-error block mt-1">
                  {errors.email}
                </small>
              )}
            </div>

            <div className="flex-1">
              <FloatLabel className="always-float">
                <InputText
                  id="mobile"
                  value={formData.mobile}
                  className={`w-full ${errors.mobile ? 'p-invalid' : ''}`}
                  keyfilter="pint"
                  onChange={(e) => {
                    const input = e.target.value
                    if (/^\d{0,10}$/.test(input)) {
                      handleChange('mobile', input)
                    }
                  }}
                />
                <label htmlFor="mobile">Mobile</label>
              </FloatLabel>
              {errors.mobile && (
                <small id="mobile-help" className="p-error block mt-1">
                  {errors.mobile}
                </small>
              )}
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
                <Dropdown
                  id="state"
                  filter
                  value={formData.state}
                  options={states.map((s) => ({ label: s.name, value: s.name }))}
                  onChange={(e: DropdownChangeEvent) => handleChange('state', e.value)}
                  className="w-full"
                  placeholder="Select State"
                />
                <label htmlFor="state">State</label>
              </FloatLabel>
            </div>

            <div className="flex-1">
              <FloatLabel className="always-float">
                <Dropdown
                  id="city"
                  filter
                  value={formData.city}
                  options={cities.map((c) => ({ label: c.name, value: c.name }))}
                  onChange={(e: DropdownChangeEvent) => handleChange('city', e.value)}
                  className="w-full"
                  placeholder="Select City"
                />
                <label htmlFor="city">City</label>
              </FloatLabel>
            </div>
          </div>
        </div>

        {/* CONFIGURATION */}
        <div>
          <p className="font-semibold text-lg mb-3 uppercase underline">Configuration</p>
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
                  filter
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

      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          label="Save"
          icon="pi pi-check"
          className="bg-[#8e5ea8] border-none gap-2"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        />
      </div>
    </div>
  )
}

export default SettingsAddEmployees
