export interface StatusOption {
  name: string
  isActive: boolean
}

export interface EmployeeFormData {
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

export interface RoleTypeProps {
  refRTId: number
  refRTName: string
}

export interface BranchTypeProps {
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

export interface StateType {
  name: string
  isoCode: string
  countryCode: string
  latitude?: string | null
  longitude?: string | null
}

export interface CityType {
  name: string
  stateCode: string
  countryCode: string
  latitude?: string | null
  longitude?: string | null
}
