import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import { ChartNoAxesCombined, ShoppingBasket, Sparkles } from 'lucide-react'
import { Divider } from 'primereact/divider'
import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div>
      <IndivHeader title="Dashboard" subtitle="Monday, Jun 15, 2025" />
      <div className="flex m-3">
        <div className="dashboardItems flex gap-3" style={{ width: '100%' }}>
          {/* FIRST COLUMNS - 30% */}
          <div className="flex flex-column gap-3" style={{ width: '30%' }}>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 border-round-md px-3 py-2 gap-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ChartNoAxesCombined />
                  <p className="text-sm">Total Sales</p>
                </div>
                <p className="text-2xl font-bold">$ 26,00,000</p>
                <p className="text-xs">
                  <span className="font-semibold">+2.8%</span> from last month
                </p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>
                  <span className="font-semibold">+2.8% </span>from last month
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 border-round-md px-3 py-2 gap-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ChartNoAxesCombined />
                  <p className="text-sm">Total Sales</p>
                </div>
                <p className="text-2xl font-bold">$ 26,00,000</p>
                <p className="text-xs">
                  <span className="font-semibold">+2.8%</span> from last month
                </p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>
                  <span className="font-semibold">+2.8% </span>from last month
                </p>
              </div>
            </div>
          </div>
          {/* SECOND COLUMNS - 30% */}
          <div className="flex flex-column gap-3" style={{ width: '30%' }}>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ChartNoAxesCombined />
                  <p>Total Sales</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ChartNoAxesCombined />
                  <p>Total Sales</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center justify-content-between">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
            </div>
          </div>{' '}
          {/* LAST COLUMNS - 40% */}
          <div className="flex flex-column lastGrids" style={{ width: '40%' }}>
            <div className="flex w-full flex-column shadow-2 px-3 py-2">
              <div className="flex items-center justify-content-between">
                <Sparkles />
                <p>Top Products</p>
              </div>
              <div className="flex items-center justify-content-between">
                <p>Name</p>
                <p>Sales</p>
              </div>
              <Divider />
              <div className="flex items-center justify-content-between">
                <div className="flex">
                  <p>01</p>
                  <p>Product Name</p>
                </div>
                <p>Count</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
