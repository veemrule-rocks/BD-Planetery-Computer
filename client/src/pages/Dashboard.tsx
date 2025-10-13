import { useState } from "react";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { MetricCard } from "@/components/MetricCard";
import { AlertCard } from "@/components/AlertCard";
import { LayerControlPanel } from "@/components/LayerControlPanel";
import { RegionDetailPanel } from "@/components/RegionDetailPanel";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Filter, Droplets, Wind, ThermometerSun, CloudRain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [showAlerts, setShowAlerts] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-3 bg-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Environmental Monitoring Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time data from Microsoft Planetary Computer</p>
          </div>
          <div className="flex items-center gap-2">
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
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <MapPlaceholder />
          
          <div className="absolute top-4 left-4 z-10">
            <LayerControlPanel />
          </div>

          <div className="absolute top-4 right-4 z-10 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                title="Water Level"
                value="6.2"
                unit="m"
                severity="caution"
                icon={Droplets}
                trend={{ value: 12, direction: "up" }}
              />
              <MetricCard
                title="Wind Speed"
                value="45"
                unit="km/h"
                severity="critical"
                icon={Wind}
                trend={{ value: 18, direction: "up" }}
              />
              <MetricCard
                title="Temperature"
                value="32"
                unit="°C"
                severity="safe"
                icon={ThermometerSun}
              />
              <MetricCard
                title="Rainfall"
                value="145"
                unit="mm"
                severity="caution"
                icon={CloudRain}
              />
            </div>
          </div>

          {selectedRegion && (
            <div className="absolute bottom-4 right-4 z-10">
              <RegionDetailPanel
                region={selectedRegion}
                onClose={() => setSelectedRegion(null)}
              />
            </div>
          )}

          {showAlerts && (
            <div className="absolute bottom-4 left-4 z-10 w-96">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  <AlertCard
                    severity="critical"
                    type="Flood Warning"
                    location="Dhaka Division, Gazipur District"
                    description="Water level rising rapidly. Evacuation recommended."
                    timestamp="15 minutes ago"
                    onViewDetails={() => setSelectedRegion({
                      name: 'Gazipur',
                      division: 'Dhaka',
                      population: '5.2 million',
                      elevation: '8m',
                      riskLevel: 'high' as const,
                      waterLevel: '6.8m',
                      rainfall: '145mm',
                      alerts: 2,
                    })}
                  />
                  <AlertCard
                    severity="high"
                    type="Cyclone Alert"
                    location="Chittagong Division, Cox's Bazar"
                    description="Tropical cyclone approaching coastal areas."
                    timestamp="1 hour ago"
                  />
                  <AlertCard
                    severity="medium"
                    type="Heavy Rainfall"
                    location="Sylhet Division"
                    description="Continuous heavy rainfall expected."
                    timestamp="3 hours ago"
                  />
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
