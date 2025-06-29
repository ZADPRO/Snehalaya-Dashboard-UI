import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import { ChartNoAxesCombined, ShoppingBasket, Sparkles } from 'lucide-react'
import { Divider } from 'primereact/divider'
import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div>
      <IndivHeader title="Dashboard" subtitle="Monday, Jun 15, 2025" />
      <div className="flex">
        <div className="dashboardItems flex gap-3">
          <div className="flex-2 flex flex-column">
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center">
                  <ChartNoAxesCombined />
                  <p>Total Sales</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
            </div>
          </div>
          <div className="flex-2 flex flex-column">
            <div className="flex gap-3">
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center">
                  <ChartNoAxesCombined />
                  <p>Total Sales</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
              <div className="flex-1 flex flex-column shadow-2 px-3 py-2">
                <div className="iconItems flex align-items-center">
                  <ShoppingBasket />
                  <p>Total Orders</p>
                </div>
                <p>$ 26,00,000</p>
                <p>+2.8% from last month</p>
              </div>
            </div>
          </div>{' '}
          <div className="flex-3 flex flex-column">
            <div className="flex  w-full flex-column shadow-2">
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
