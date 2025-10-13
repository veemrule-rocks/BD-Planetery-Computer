import { useQuery } from "@tanstack/react-query";
import { AlertCard } from "@/components/AlertCard";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, AlertTriangle, MapPin } from "lucide-react";
import type { Alert, EnvironmentalMetric } from "@shared/schema";

export default function FloodMonitoring() {
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const { data: metrics = [] } = useQuery<EnvironmentalMetric[]>({
    queryKey: ['/api/metrics/current'],
  });

  const floodAlerts = alerts.filter(a => a.type.toLowerCase().includes('flood'));
  const waterLevelMetrics = metrics.filter(m => m.type === 'water_level');

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div>
        <h1 className="text-2xl font-bold">Flood Monitoring System</h1>
        <p className="text-muted-foreground">Real-time flood warnings and water level tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flood Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{floodAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {floodAlerts.filter(a => a.severity === 'critical').length} Critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Stations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{waterLevelMetrics.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across Bangladesh</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">River Basins</CardTitle>
            <Waves className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Major river systems</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Water Level Monitoring</h2>
          {waterLevelMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.location}
              value={metric.value.toString()}
              unit={metric.unit}
              severity={metric.severity}
              icon={Waves}
              trend={metric.trend}
              lastUpdated={new Date(metric.timestamp).toLocaleString()}
            />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Flood Alerts</h2>
          {floodAlerts.length > 0 ? (
            floodAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                severity={alert.severity}
                type={alert.type}
                location={`${alert.division} Division, ${alert.district}`}
                description={alert.description}
                timestamp={new Date(alert.timestamp).toLocaleString()}
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No active flood alerts
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
