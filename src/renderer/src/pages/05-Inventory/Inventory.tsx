import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
// import InventoryManageStocks from '@renderer/components/InventoryManageStocks/InventoryManageStocks'
import InventoryStockHistory from '@renderer/components/InventoryStockHistory/InventoryStockHistory'
import InventoryStockTake from '@renderer/components/InventoryStockTake/InventoryStockTake'
import InventoryStockTransfer from '@renderer/components/InventoryStockTransfer/InventoryStockTransfer'
import { FolderCheck, FolderInput, FolderOutput, FolderSync } from 'lucide-react'
import { Divider } from 'primereact/divider'
import React, { useState } from 'react'

const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <FolderCheck />,
    component: <InventoryStockHistory />
  },
  // {
  //   key: 'managestocks',
  //   label: 'Manage Stocks',
  //   icon: <FolderPen />,
  //   component: <InventoryManageStocks />
  // },
  {
    key: 'stockhistory',
    label: 'Stock History',
    icon: <FolderSync />,
    component: <InventoryStockHistory />
  },
  {
    key: 'stocktransfer',
    label: 'Stock Transfer',
    icon: <FolderOutput />,
    component: <InventoryStockTransfer />
  },
  {
    key: 'stocktake',
    label: 'Stock Take',
    icon: <FolderInput />,
    component: <InventoryStockTake />
  }
]

const Inventory: React.FC = () => {
  const [activeKey, setActiveKey] = useState('managestocks')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Purchase Order" subtitle="Modify User Details" />
      <div
        className="flex flex-1 m-1 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div
          className="flex flex-column px-2 my-2 border-round-md overflow-auto"
          style={{ width: '17%' }}
        >
          <div className="sidebarContainer flex flex-column gap-2">
            {sidebarItems.map((item) => {
              const isActive = item.key === activeKey
              return (
                <div
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className="iconContents cursor-pointer border-round-md px-2 py-1 flex align-items-center gap-2"
                  style={{
                    border: '1px solid #8e5ea8',
                    backgroundColor: isActive ? '#f3e9f8' : 'transparent'
                  }}
                >
                  {item.icon}
                  <p className="m-0 text-sm">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        <Divider layout="vertical" />

        <div
          className="flex flex-column border-round-md p-3 overflow-auto"
          style={{ width: '83%' }}
        >
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default Inventory
