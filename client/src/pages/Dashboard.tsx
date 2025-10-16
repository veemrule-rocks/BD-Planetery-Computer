import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InteractiveMap } from "@/components/InteractiveMap";
import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { LayerControlPanel } from "@/components/LayerControlPanel";
import { RegionDetailPanel } from "@/components/RegionDetailPanel";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Filter, Droplets, Wind, ThermometerSun, CloudRain, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnvironmentalMetric, Alert } from "@shared/schema";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [showAlerts, setShowAlerts] = useState(true);

  const { data: metrics = [] } = useQuery<EnvironmentalMetric[]>({
    queryKey: ['/api/metrics/current'],
  });

  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const getIconForMetricType = (type: string) => {
    switch (type) {
      case 'water_level': return Droplets;
      case 'wind_speed': return Wind;
      case 'temperature': return ThermometerSun;
      case 'rainfall': return CloudRain;
      default: return Droplets;
    }
  };

  const handleViewAlertDetails = async (alert: Alert) => {
    try {
      const response = await fetch(`/api/region/${alert.district.toLowerCase()}`);
      if (response.ok) {
        const regionData = await response.json();
        setSelectedRegion(regionData);
      }
    } catch (error) {
      console.error('Error fetching region data:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">Environmental Monitoring Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time data from Microsoft Planetary Computer</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DateRangeSelector />
            <Button variant="outline" size="icon" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setShowAlerts(!showAlerts)}
              data-testid="button-alerts"
            >
              <Bell className="h-4 w-4" />
              {alerts.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {alerts.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Metric Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                title={metric.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                value={metric.value.toString()}
                unit={metric.unit}
                severity={metric.severity}
                icon={getIconForMetricType(metric.type)}
                trend={metric.trend}
                lastUpdated={new Date(metric.timestamp).toLocaleString('en-US', { 
                  hour: 'numeric', 
                  minute: 'numeric',
                  hour12: true 
                })}
              />
            ))}
          </div>

          {/* Map Section with Layer Control */}
          <div className="relative">
            <InteractiveMap alerts={alerts} metrics={metrics} />
            
            {/* Layer Control Panel - Absolutely positioned on map */}
            <div className="absolute top-4 left-4 z-10">
              <LayerControlPanel />
            </div>
          </div>

          {/* Alerts Section */}
          {showAlerts && alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Active Alerts ({alerts.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAlerts(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      severity={alert.severity}
                      type={alert.type}
                      location={`${alert.division} Division, ${alert.district}`}
                      description={alert.description}
                      timestamp={new Date(alert.timestamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                      onViewDetails={() => handleViewAlertDetails(alert)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Region Detail Panel */}
          {selectedRegion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Region Details: {selectedRegion.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRegion(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RegionDetailPanel
                  region={selectedRegion}
                  onClose={() => setSelectedRegion(null)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
