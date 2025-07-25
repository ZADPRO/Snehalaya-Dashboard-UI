import IndivHeader from '../..//components/IndivHeader/IndivHeader'
import POCreateProducts from '../..//components/POCreateProducts/POCreateProducts'
import POMgmtCreatePurchase from '../..//components/POMgmtCreatePurchase/POCreateNewPurchase'
import POMgmtOverview from '../..//components/POMgmtOverview/POMgmtOverview'
import POMgmtViewPurchase from '../../components/POMgmtViewPurchase/POMgmtViewPurchase'
import POGoodsReturned from '../../components/POGoodsReturned/POGoodsReturned'
import POGoodsReceived from '../../components/POGoodsReceived/POGoodsReceived'
import {
  Barcode,
  Blocks,
  PackageCheck,
  // PackageMinus,
  PackagePlus,
  PackageSearch,
  PackageX,
  ShoppingBag,
  SquarePlus
} from 'lucide-react'
import { Divider } from 'primereact/divider'
import React, { useState } from 'react'
import BarcodePrint from '../../components/BarcodePrint/parentBarcode'
import Products from '../../components/POProducts/POProducts'

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
    component: <POMgmtCreatePurchase />
  },
  {
    key: 'products',
    label: 'Products',
    icon: <PackageSearch />,
    component: <Products />
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
    component: <POGoodsReceived />
  },
  // {
  //   key: 'goodsHold',
  //   label: 'Goods Hold',
  //   icon: <PackageMinus />,
  //   component: <POCreateProducts />
  // },
  {
    key: 'returnedGoods',
    label: 'Goods Returned',
    icon: <PackageX />,
    component: <POGoodsReturned />
  },
  {
    key: 'barcode',
    label: 'BarcodePrint',
    icon: <Barcode />,
    component: <BarcodePrint />
  }
]

const POMgmt: React.FC = () => {
  const [activeKey, setActiveKey] = useState('createProducts')

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Purchase Order" subtitle="Modify User Details" />
      <div
        className="flex flex-1 m-1 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div
          className="flex flex-column px-2 my-2 border-round-md overflow-auto"
          style={{ width: '15%' }}
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
          style={{ width: '85%' }}
        >
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  )
}

export default POMgmt
