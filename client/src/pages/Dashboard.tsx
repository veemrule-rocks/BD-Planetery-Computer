import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InteractiveMap } from "@/components/InteractiveMap";
import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { CollapsibleLayerControl } from "@/components/CollapsibleLayerControl";
import { RegionDetailPanel } from "@/components/RegionDetailPanel";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Filter, Droplets, Wind, ThermometerSun, CloudRain, AlertTriangle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Fixed Header */}
      <header className="flex-none border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Bangladesh Environmental Monitor</h1>
              <p className="text-sm text-muted-foreground">Microsoft Planetary Computer • Real-time Data</p>
            </div>
            <div className="flex items-center gap-3">
              <DateRangeSelector />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant={alerts.length > 0 ? "destructive" : "outline"} 
                size="sm"
                className="gap-2"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="h-4 w-4" />
                <Badge variant="secondary">{alerts.length}</Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-6 space-y-6">
          
          {/* Hero Metrics - Slimmer, Cleaner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="h-full">
                <MetricCard
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
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Map - Takes 3 columns */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Live Map</CardTitle>
                      <CardDescription className="text-xs">
                        Interactive monitoring • Zoom: 1000km radius from Dhaka
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {metrics.length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <InteractiveMap 
                    alerts={alerts} 
                    metrics={metrics}
                    className="h-[600px] rounded-b-lg border-0"
                  />
                  {/* Collapsible Layer Controls - Bottom Left */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <CollapsibleLayerControl />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Sidebar - Takes 1 column */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Alerts
                    </CardTitle>
                    <Badge variant="destructive">{alerts.length}</Badge>
                  </div>
                  <CardDescription className="text-xs">Active warnings</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <div className="max-h-[550px] overflow-y-auto p-4 space-y-3">
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <AlertCard
                          key={alert.id}
                          severity={alert.severity}
                          type={alert.type}
                          location={`${alert.district}, ${alert.division}`}
                          description={alert.description}
                          timestamp={new Date(alert.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                          onViewDetails={() => handleViewAlertDetails(alert)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No active alerts
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Region Details - Full Width when active */}
          {selectedRegion && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Region Details: {selectedRegion.name}</CardTitle>
                    <CardDescription>{selectedRegion.division} Division</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedRegion(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Population</p>
                    <p className="text-2xl font-bold">{selectedRegion.population}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                    <Badge 
                      variant={selectedRegion.riskLevel === 'critical' ? 'destructive' : 'secondary'}
                      className="text-sm"
                    >
                      {selectedRegion.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Water Level</p>
                    <p className="text-2xl font-bold">{selectedRegion.waterLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rainfall (24h)</p>
                    <p className="text-2xl font-bold">{selectedRegion.rainfall}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Elevation</p>
                    <p className="text-2xl font-bold">{selectedRegion.elevation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                    <p className="text-2xl font-bold text-destructive">{selectedRegion.alerts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom Spacer */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
