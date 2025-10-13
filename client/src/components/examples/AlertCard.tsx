import { AlertCard } from '../AlertCard'

export default function AlertCardExample() {
  return (
    <div className="space-y-3 p-4">
      <AlertCard
        severity="critical"
        type="Flood Warning"
        location="Dhaka Division, Gazipur District"
        description="Water level rising rapidly. Evacuation recommended for low-lying areas."
        timestamp="15 minutes ago"
        onViewDetails={() => console.log('View flood warning details')}
      />
      <AlertCard
        severity="high"
        type="Cyclone Alert"
        location="Chittagong Division, Cox's Bazar"
        description="Tropical cyclone approaching coastal areas. Wind speed 85 km/h expected."
        timestamp="1 hour ago"
        onViewDetails={() => console.log('View cyclone alert details')}
      />
      <AlertCard
        severity="medium"
        type="Heavy Rainfall"
        location="Sylhet Division"
        description="Continuous heavy rainfall expected for next 48 hours."
        timestamp="3 hours ago"
      />
    </div>
  )
}
