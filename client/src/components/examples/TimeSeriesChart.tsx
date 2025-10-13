import { TimeSeriesChart } from '../TimeSeriesChart'

export default function TimeSeriesChartExample() {
  const data = [
    { month: 'Jan', temperature: 18, rainfall: 12 },
    { month: 'Feb', temperature: 20, rainfall: 25 },
    { month: 'Mar', temperature: 25, rainfall: 45 },
    { month: 'Apr', temperature: 28, rainfall: 120 },
    { month: 'May', temperature: 30, rainfall: 280 },
    { month: 'Jun', temperature: 31, rainfall: 420 },
    { month: 'Jul', temperature: 31, rainfall: 380 },
    { month: 'Aug', temperature: 30, rainfall: 320 },
    { month: 'Sep', temperature: 29, rainfall: 240 },
    { month: 'Oct', temperature: 27, rainfall: 180 },
    { month: 'Nov', temperature: 23, rainfall: 50 },
    { month: 'Dec', temperature: 19, rainfall: 15 },
  ]

  const yKeys = [
    { key: 'temperature', label: 'Temperature (°C)', color: 'hsl(var(--chart-1))' },
    { key: 'rainfall', label: 'Rainfall (mm)', color: 'hsl(var(--chart-2))' },
  ]

  return (
    <div className="p-4">
      <TimeSeriesChart
        title="Climate Trends 2024"
        data={data}
        xKey="month"
        yKeys={yKeys}
      />
    </div>
  )
}
