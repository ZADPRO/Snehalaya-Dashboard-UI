import axios from 'axios'
import { RoleTypeProps, BranchTypeProps } from './SettingsAddEmployees.types'

export const getEmployeeRoleType = async (): Promise<RoleTypeProps[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/admin/settings/employeeRoleType`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('token') || ''
      }
    }
  )
  return response.data.roles
}

export const getBranchDetails = async (): Promise<BranchTypeProps[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/settings/branches`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: sessionStorage.getItem('token') || ''
    }
  })
  return response.data.data
}
