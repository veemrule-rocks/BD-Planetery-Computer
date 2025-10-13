import { MetricCard } from '../MetricCard'
import { Droplets, Wind, ThermometerSun } from 'lucide-react'

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <MetricCard
        title="Water Level"
        value="6.2"
        unit="meters"
        severity="caution"
        icon={Droplets}
        trend={{ value: 12, direction: "up" }}
        lastUpdated="2 hours ago"
      />
      <MetricCard
        title="Temperature"
        value="32"
        unit="°C"
        severity="safe"
        icon={ThermometerSun}
        trend={{ value: 3, direction: "down" }}
        lastUpdated="1 hour ago"
      />
      <MetricCard
        title="Wind Speed"
        value="45"
        unit="km/h"
        severity="critical"
        icon={Wind}
        trend={{ value: 18, direction: "up" }}
        lastUpdated="30 mins ago"
      />
    </div>
  )
}
