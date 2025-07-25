import React, { useState } from 'react'
import {
  FolderKanban,
  Layers3,
  Landmark,
  PackageSearch,
  UsersRound,
  BadgeInfo,
  // Banknote,
  PanelsTopLeft,
  SlidersVertical
} from 'lucide-react'
import { Divider } from 'primereact/divider'

import './Settings.css'
import SettingsOverview from '../../components/SettingsOverview/SettingsOverview'
import SettingsCategories from '../../components/SettingsCategories/SettingsCategories'
import SettingsSubCategories from '../../components/SettingsSubCategories/SettingsSubCategories'
import SettingsBranches from '../../components/SettingsBranches/SettingsBranches'
import SettingsSuppliers from '../../components/SettingsSuppliers/SettingsSuppliers'
import SettingsUsers from '../../components/SettingsUsers/SettingsUsers'
import SettingsAttributes from '../../components/SettingsAttributes/SettingsAttributes'
import SettingsEmployees from '../../components/SettingsEmployees/SettingsEmployees'
import IndivHeader from '../../components/IndivHeader/IndivHeader'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <PanelsTopLeft />,
    component: <SettingsOverview />
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: <FolderKanban />,
    component: <SettingsCategories />
  },
  {
    key: 'subcategories',
    label: 'Sub Categories',
    icon: <Layers3 />,
    component: <SettingsSubCategories />
  },
  { key: 'branches', label: 'Branches', icon: <Landmark />, component: <SettingsBranches /> },
  {
    key: 'suppliers',
    label: 'Suppliers',
    icon: <PackageSearch />,
    component: <SettingsSuppliers />
  },
  { key: 'users', label: 'Users Roles', icon: <UsersRound />, component: <SettingsUsers /> },
  {
    key: 'attributes',
    label: 'Attributes',
    icon: <SlidersVertical />,
    component: <SettingsAttributes />
  },
  { key: 'employees', label: 'Employees', icon: <BadgeInfo />, component: <SettingsEmployees /> }
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('categories')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Settings" subtitle="Monday, Jun 15, 2025" />
      <div
        className="flex flex-1 m-1 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div
          className="flex flex-column px-2 my-2 border-round-md overflow-auto"
          style={{ width: '20%' }}
        >
          <div className="sidebarContainer flex flex-column gap-2">
            {sidebarItems.map((item) => {
              const isActive = item.key === activeKey
              return (
                <div
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className="iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2"
                  style={{
                    border: '1px solid #8e5ea8',
                    backgroundColor: isActive ? '#f3e9f8' : 'transparent'
                  }}
                >
                  {item.icon}
                  <p className="m-0">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        <Divider layout="vertical" />

        <div
          className="flex flex-column border-round-md p-2 overflow-auto"
          style={{ width: '80%' }}
        >
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default Settings
