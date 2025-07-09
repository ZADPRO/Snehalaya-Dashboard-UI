import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import POCreateProducts from '@renderer/components/POCreateProducts/POCreateProducts'
import POCreateNewPurchase from '@renderer/components/POMgmtCreatePurchase/POCreateNewPurchase'
import POMgmtCreatePurchase from '@renderer/components/POMgmtCreatePurchase/POMgmtCreatePurchase'
import POMgmtOverview from '@renderer/components/POMgmtOverview/POMgmtOverview'
import POMgmtViewPurchase from '@renderer/components/POMgmtViewPurchase/POMgmtViewPurchase'
import POProducts from '@renderer/components/POProducts/POProducts'
import {
  Blocks,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  PackageSearch,
  PackageX,
  ShoppingBag,
  SquarePlus
} from 'lucide-react'
import { Divider } from 'primereact/divider'
import React, { useState } from 'react'

// Sidebar items config
const sidebarItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: <Blocks />,
    component: <POMgmtOverview />
  },
  {
    key: 'list',
    label: 'Purchase Order',
    icon: <ShoppingBag />,
    component: <POMgmtViewPurchase />
  },
  {
    key: 'create',
    label: 'Create Purchase',
    icon: <SquarePlus />,
    component: <POCreateNewPurchase />
  },
  {
    key: 'products',
    label: 'Products',
    icon: <PackageSearch />,
    component: <POProducts />
  },
  {
    key: 'createProducts',
    label: 'Create Products',
    icon: <PackagePlus />,
    component: <POCreateProducts />
  },
  {
    key: 'goodsReceived',
    label: 'Goods Received',
    icon: <PackageCheck />,
    component: <POCreateProducts />
  },
  {
    key: 'goodsHold',
    label: 'Goods Hold',
    icon: <PackageMinus />,
    component: <POCreateProducts />
  },
  {
    key: 'returnedGoods',
    label: 'Goods Returned',
    icon: <PackageX />,
    component: <POCreateProducts />
  }
]

const POMgmt: React.FC = () => {
  const [activeKey, setActiveKey] = useState('create')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Purchase Order" subtitle="Modify User Details" />
      <div
        className="flex flex-1 m-3 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div
          className="flex flex-column px-3 my-3 border-round-md overflow-auto"
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
