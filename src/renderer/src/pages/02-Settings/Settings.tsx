import React, { useState } from 'react'
import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import {
  FolderKanban,
  Layers3,
  Landmark,
  PackageSearch,
  UsersRound,
  BadgeInfo,
  Banknote
} from 'lucide-react'
import { Divider } from 'primereact/divider'

// Dummy components for demonstration
const Categories = () => <div>Categories Component</div>
const SubCategories = () => <div>Sub Categories Component</div>
const Branches = () => <div>Branches Component</div>
const Suppliers = () => <div>Suppliers Component</div>
const Users = () => <div>Users Component</div>
const Employees = () => <div>Employees Component</div>
const Bank = () => <div>Bank Component</div>

const sidebarItems = [
  { key: 'categories', label: 'Categories', icon: <FolderKanban />, component: <Categories /> },
  {
    key: 'subcategories',
    label: 'Sub Categories',
    icon: <Layers3 />,
    component: <SubCategories />
  },
  { key: 'branches', label: 'Branches', icon: <Landmark />, component: <Branches /> },
  { key: 'suppliers', label: 'Suppliers', icon: <PackageSearch />, component: <Suppliers /> },
  { key: 'users', label: 'Users', icon: <UsersRound />, component: <Users /> },
  { key: 'employees', label: 'Employees', icon: <BadgeInfo />, component: <Employees /> },
  { key: 'bank', label: 'Bank', icon: <Banknote />, component: <Bank /> }
]

const Settings: React.FC = () => {
  const [activeKey, setActiveKey] = useState('categories')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Settings" subtitle="Monday, Jun 15, 2025" />
      <div
        className="flex flex-1 m-3 shadow-2 border-round-md"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div className="flex flex-column p-2 border-round-md" style={{ width: '20%' }}>
          <div className="sidebarContainer flex flex-column gap-2">
            {sidebarItems.map((item) => (
              <div
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`iconContents cursor-pointer border-round-md p-2 flex align-items-center gap-2 ${activeKey === item.key ? 'bg-blue-100' : ''}`}
                style={{ border: '1px solid #8e5ea8' }}
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Divider layout="vertical" />

        <div
          className="flex flex-column border-round-md p-3 overflow-auto"
          style={{ width: '80%' }}
        >
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default Settings
