import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import { Split } from 'lucide-react'
import { Divider } from 'primereact/divider'
import React from 'react'

const Settings: React.FC = () => {
  return (
    <div>
      <IndivHeader title="Settings" subtitle="Monday, Jun 15, 2025" />
      <div className="flex m-3 shadow-1 border-round-md" style={{ height: '100%' }}>
        <div
          className="flex flex-column p-2 border-round-md"
          style={{ width: '20%', height: '100%' }}
        >
          <div className="sidebarContainer flex flex-column gap-2">
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Categories</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Sub Categories</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Branches</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Suppliers</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Users</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Employees</p>
            </div>
            <div className="iconContents shadow-1 border-round-md p-2 flex align-items-center gap-2">
              <Split />
              <p>Bank</p>
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div className="flex flex-column border-round-md" style={{ width: '80%' }}></div>
      </div>
    </div>
  )
}

export default Settings
