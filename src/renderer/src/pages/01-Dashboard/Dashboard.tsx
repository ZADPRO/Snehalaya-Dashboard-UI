import React, { JSX } from 'react'
import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import { ChartNoAxesCombined, ShoppingBasket, Sparkles, Users, IndianRupee } from 'lucide-react'
import { Divider } from 'primereact/divider'
import { Skeleton } from 'primereact/skeleton'
import DashboardChartAnalysisTesting from '@renderer/components/DashboardChartAnalysisTesting/DashboardChartAnalysisTesting'

const Dashboard: React.FC = () => {
  // CARD ALIGNMENT DATA
  const metricsData = [
    {
      icon: <ChartNoAxesCombined />,
      title: 'Total Sales',
      value: '₹ 26,00,000',
      growth: '+2.8%'
    },
    {
      icon: <ShoppingBasket />,
      title: 'Total Orders',
      value: '1,200',
      growth: '+1.5%'
    },
    {
      icon: <IndianRupee />,
      title: 'Revenue',
      value: '₹ 19,50,000',
      growth: '+3.2%'
    },
    {
      icon: <Users />,
      title: 'New Customers',
      value: '650',
      growth: '+4.0%'
    },
    {
      icon: <ChartNoAxesCombined />,
      title: 'Repeat Customers',
      value: '350',
      growth: '+2.1%'
    },
    {
      icon: <ShoppingBasket />,
      title: 'Pending Orders',
      value: '75',
      growth: '-0.8%'
    }
  ]
  const topProducts = [
    { id: '01', name: 'Kanchipuram Silk Saree', sales: 150 },
    { id: '02', name: 'Banarasi Saree', sales: 130 },
    { id: '03', name: 'Cotton Handloom Saree', sales: 110 },
    { id: '04', name: 'Chiffon Printed Saree', sales: 90 },
    { id: '05', name: 'Tussar Silk Saree', sales: 75 }
  ]
  // Step 1: Fill up to 8 cards (data + skeletons)
  const totalCards = 8

  const filledMetrics: ({
    icon: JSX.Element
    title: string
    value: string
    growth: string
  } | null)[] = [...metricsData]

  const skeletonCount = totalCards - filledMetrics.length

  for (let i = 0; i < skeletonCount; i++) {
    filledMetrics.push(null)
  }
  // Step 2: Create rows with 2 cards per row for each column
  const col1Rows: React.ReactNode[] = []
  const col2Rows: React.ReactNode[] = []

  for (let i = 0; i < totalCards; i += 4) {
    // 2 cards for column 1
    const col1 = [filledMetrics[i], filledMetrics[i + 1]].map((metric, idx) => (
      <div
        key={`col1-${i + idx}`}
        className="flex-1 flex flex-column cardBgSection shadow-2 border-round-md px-3 py-2 gap-2"
      >
        {metric ? (
          <>
            <div className="flex align-items-center justify-content-between">
              {metric.icon}
              <p className="text-sm">{metric.title}</p>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs">
              <span
                className="font-semibold"
                style={{ color: metric.growth.startsWith('+') ? 'green' : 'red' }}
              >
                {metric.growth}
              </span>{' '}
              from last month
            </p>
          </>
        ) : (
          <>
            <div className="flex align-items-center justify-content-between">
              <Skeleton width="1rem" height="1rem" shape="circle" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <Skeleton width="8rem" height="1rem" />
            <Skeleton width="6rem" height="1rem" />
          </>
        )}
      </div>
    ))

    col1Rows.push(
      <div key={`row-col1-${i}`} className="flex gap-3">
        {col1}
      </div>
    )

    // 2 cards for column 2
    const col2 = [filledMetrics[i + 2], filledMetrics[i + 3]].map((metric, idx) => (
      <div
        key={`col2-${i + 2 + idx}`}
        className="flex-1 flex flex-column cardBgSection shadow-2 border-round-md px-3 py-2 gap-2"
      >
        {metric ? (
          <>
            <div className="flex align-items-center justify-content-between">
              {metric.icon}
              <p className="text-sm">{metric.title}</p>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs">
              <span
                className="font-semibold"
                style={{ color: metric.growth.startsWith('+') ? 'green' : 'red' }}
              >
                {metric.growth}
              </span>{' '}
              from last month
            </p>
          </>
        ) : (
          <>
            <div className="flex align-items-center gap-3">
              <Skeleton width="1.3rem" height="1.3rem" shape="circle" />
              <Skeleton width="7rem" height="1.3rem" />
            </div>
            <Skeleton width="10rem" height="1.5rem" />
            <Skeleton width="9rem" height="1.5rem" />
          </>
        )}
      </div>
    ))

    col2Rows.push(
      <div key={`row-col2-${i}`} className="flex gap-3">
        {col2}
      </div>
    )
  }

  return (
    <div>
      <IndivHeader title="Dashboard" subtitle="Monday, Jun 15, 2025" />

      <div className="flex flex-column m-3">
        <div className="dashboardItems flex flex-row gap-3" style={{ width: '100%' }}>
          {/* Column 1 - 30% */}
          <div className="flex flex-column gap-3" style={{ width: '30%' }}>
            {col1Rows}
          </div>

          {/* Column 2 - 30% */}
          <div className="flex flex-column gap-3" style={{ width: '30%' }}>
            {col2Rows}
          </div>

          {/* Third Column - 40% */}
          <div className="flex flex-column lastGrids" style={{ width: '40%' }}>
            <div className="flex w-full flex-column shadow-2 border-round-md px-3 py-2 gap-2">
              <div className="flex items-center justify-content-between">
                <Sparkles />
                <p>Top Products</p>
              </div>
              <div className="flex items-center justify-content-between">
                <p className="text-sm font-semibold">Name</p>
                <p className="text-sm font-semibold">Sales</p>
              </div>
              <Divider />
              {topProducts.map((product, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center justify-content-between">
                    <div className="flex gap-2">
                      <p>{product.id}</p>
                      <p>{product.name}</p>
                    </div>
                    <p>{product.sales}</p>
                  </div>
                  {idx !== topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3" style={{ width: '100%' }}>
          <div className="flex flex-column gap-3" style={{ width: '60%' }}>
            <DashboardChartAnalysisTesting />
          </div>
          {/* <div className="flex flex-column gap-3 mt-3" style={{ width: '20%' }}>
            <div className="flex w-full flex-column shadow-2 border-round-md px-3 py-2 gap-2">
              <div className="flex items-center justify-content-between">
                <Sparkles />
                <p>Top Products</p>
              </div>
              <div className="flex items-center justify-content-between">
                <p className="text-sm font-semibold">Name</p>
                <p className="text-sm font-semibold">Sales</p>
              </div>
              <Divider />
              {topProducts.map((product, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center justify-content-between">
                    <div className="flex gap-2">
                      <p>{product.id}</p>
                      <p>{product.name}</p>
                    </div>
                    <p>{product.sales}</p>
                  </div>
                  {idx !== topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-column gap-3 mt-3" style={{ width: '20%' }}>
            <div className="flex w-full flex-column shadow-2 border-round-md px-3 py-2 gap-2">
              <div className="flex items-center justify-content-between">
                <Sparkles />
                <p>Top Products</p>
              </div>
              <div className="flex items-center justify-content-between">
                <p className="text-sm font-semibold">Name</p>
                <p className="text-sm font-semibold">Sales</p>
              </div>
              <Divider />
              {topProducts.map((product, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center justify-content-between">
                    <div className="flex gap-2">
                      <p>{product.id}</p>
                      <p>{product.name}</p>
                    </div>
                    <p>{product.sales}</p>
                  </div>
                  {idx !== topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
