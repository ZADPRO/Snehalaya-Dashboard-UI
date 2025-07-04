import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart'

const DashboardChartAnalysisTesting: React.FC = () => {
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'MRP',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Profit',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        }
      ]
    }
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    }

    setChartData(data)
    setChartOptions(options)
  }, [])
  return (
    <div>
      <div className="card px-3 py-3 shadow-3 border-round-md">
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default DashboardChartAnalysisTesting
