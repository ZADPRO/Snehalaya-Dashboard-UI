import React, { JSX } from 'react'
import { ChartNoAxesCombined, ShoppingBasket, Sparkles, Users, IndianRupee } from 'lucide-react'
import { Divider } from 'primereact/divider'
import IndivHeader from '../../components/IndivHeader/IndivHeader'
import DashboardChartAnalysisTesting from '../../components/DashboardChartAnalysisTesting/DashboardChartAnalysisTesting'

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
    const col1 = [filledMetrics[i], filledMetrics[i + 1]]
      .filter((metric) => metric)
      .map((metric, idx) => {
        if (!metric) return null // Safety check

        return (
          <div
            key={`col1-${i + idx}`}
            className="flex-1 flex flex-column shadow-2 border-round-md px-3 py-2 gap-1"
            style={{
              border: '1px solid #e39b9e'
            }}
          >
            <div className="flex align-items-center justify-content-between">
              <div
                style={{
                  color: '#000000',
                  border: '1px solid #000000',
                  padding: '3px 6px',
                  background: '#f6f7ff',
                  borderRadius: '8px'
                }}
              >
                {metric.icon}
              </div>
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
          </div>
        )
      })

    if (col1.length > 0) {
      col1Rows.push(
        <div key={`row-col1-${i}`} className="flex gap-3">
          {col1}
        </div>
      )
    }

    // 2 cards for column 2
    const col2 = [filledMetrics[i + 2], filledMetrics[i + 3]]
      .filter((metric) => metric) // skip undefined/null entries
      .map((metric, idx) => {
        if (!metric) return null

        return (
          <div
            key={`col2-${i + 2 + idx}`}
            className="flex-1 flex flex-column shadow-2 border-round-md px-3 py-2 gap-1"
            style={{
              border: '1px solid #8cc472'
            }}
          >
            <div className="flex align-items-center justify-content-between">
              <div
                style={{
                  color: '#8cc472',
                  border: '1px solid #8cc472',
                  padding: '3px 6px',
                  background: '#f6f7ff',
                  borderRadius: '8px'
                }}
              >
                {metric.icon}
              </div>
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
          </div>
        )
      })

    if (col2.length > 0) {
      col2Rows.push(
        <div key={`row-col2-${i}`} className="flex gap-3">
          {col2}
        </div>
      )
    }
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
        </div>
      </div>
    </div>
  )
}

export default Dashboard
