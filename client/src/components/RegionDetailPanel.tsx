import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin, Users, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RegionDetailPanelProps {
  region: {
    name: string;
    division: string;
    population: string;
    elevation: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    waterLevel: string;
    rainfall: string;
    alerts: number;
  } | null;
  onClose: () => void;
}

export function RegionDetailPanel({ region, onClose }: RegionDetailPanelProps) {
  if (!region) return null;

  const riskColors = {
    low: "bg-primary text-primary-foreground",
    medium: "bg-chart-3 text-white",
    high: "bg-chart-5 text-white",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="w-96" data-testid="panel-region-detail">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-lg">{region.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{region.division} Division</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Level</span>
          <Badge className={riskColors[region.riskLevel]} data-testid={`badge-risk-${region.riskLevel}`}>
            {region.riskLevel.toUpperCase()}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Population</span>
            </div>
            <span className="text-sm font-medium">{region.population}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Elevation</span>
            <span className="text-sm font-medium">{region.elevation}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Water Level</span>
            <span className="text-sm font-medium">{region.waterLevel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Rainfall (24h)</span>
            <span className="text-sm font-medium">{region.rainfall}</span>
          </div>
        </div>

        {region.alerts > 0 && (
          <>
            <Separator />
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">
                {region.alerts} Active Alert{region.alerts > 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}

        <Button className="w-full" data-testid="button-view-full-report">
          View Full Report
        </Button>
      </CardContent>
    </Card>
  );
}
