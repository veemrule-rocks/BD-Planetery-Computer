import { RegionDetailPanel } from '../RegionDetailPanel'
import { useState } from 'react'

export default function RegionDetailPanelExample() {
  const [region] = useState({
    name: 'Gazipur',
    division: 'Dhaka',
    population: '5.2 million',
    elevation: '8m above sea level',
    riskLevel: 'high' as const,
    waterLevel: '6.8m',
    rainfall: '145mm',
    alerts: 2,
  })

  return (
    <div className="p-4">
      <RegionDetailPanel
        region={region}
        onClose={() => console.log('Close panel')}
      />
    </div>
  )
}
