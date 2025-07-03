import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import SettingsOverview from '@renderer/components/SettingsOverview/SettingsOverview'
import { PanelsTopLeft, SquarePlus } from 'lucide-react'
import { Divider } from 'primereact/divider'
import React, { useState } from 'react'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <PanelsTopLeft />,
    component: <SettingsOverview />
  },
  {
    key: 'create',
    label: 'Create Purchase',
    icon: <SquarePlus />,
    component: <SquarePlus />
  }
]

const POMgmt: React.FC = () => {
  const [activeKey, setActiveKey] = useState('overview')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Profile" subtitle="Modify User Details" />
      <div
        className="flex flex-1 m-3 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div className="flex flex-column p-3 border-round-md" style={{ width: '20%' }}>
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
          className="flex flex-column border-round-md p-3 overflow-auto"
          style={{ width: '80%' }}
        >
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default POMgmt
