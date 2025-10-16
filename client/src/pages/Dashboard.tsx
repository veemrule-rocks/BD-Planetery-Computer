import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InteractiveMap } from "@/components/InteractiveMap";
import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { RegionDetailPanel } from "@/components/RegionDetailPanel";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Filter, Droplets, Wind, ThermometerSun, CloudRain, AlertTriangle, MapPin, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { EnvironmentalMetric, Alert } from "@shared/schema";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

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

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const highAlerts = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Bangladesh Environmental Monitor</h1>
                <p className="text-sm text-muted-foreground">Real-time data from Microsoft Planetary Computer</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <DateRangeSelector />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Alerts
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{criticalAlerts}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                High Priority
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{highAlerts}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active Sensors
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{metrics.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Regions Monitored
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{new Set(metrics.map(m => m.district)).size}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map & Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Interactive Map
                </CardTitle>
                <CardDescription>
                  Click markers for detailed information • Zoom limited to Bangladesh region
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap 
                  alerts={alerts} 
                  metrics={metrics}
                  className="h-[500px] rounded-none border-0"
                />
              </CardContent>
            </Card>

            {/* Environmental Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Environmental Metrics
                </CardTitle>
                <CardDescription>
                  Real-time readings from monitoring stations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts & Details */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Active Alerts
                  </span>
                  <Badge variant="destructive">{alerts.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Current warnings and advisories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="critical">Critical</TabsTrigger>
                    <TabsTrigger value="high">High</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
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
                  </TabsContent>
                  <TabsContent value="critical" className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                    {alerts.filter(a => a.severity === 'critical').map((alert) => (
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
                  </TabsContent>
                  <TabsContent value="high" className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                    {alerts.filter(a => a.severity === 'high').map((alert) => (
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Region Details */}
            {selectedRegion && (
              <Card>
                <CardHeader>
                  <CardTitle>Region Details</CardTitle>
                  <CardDescription>{selectedRegion.name}</CardDescription>
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
      </main>
    </div>
  );
}
