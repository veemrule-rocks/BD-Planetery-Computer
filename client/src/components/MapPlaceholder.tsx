import { Card } from "@/components/ui/card";
import { MapPin, Satellite } from "lucide-react";

export function MapPlaceholder() {
  return (
    <Card className="h-full w-full flex items-center justify-center bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5" />
      <div className="relative z-10 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <Satellite className="h-12 w-12 text-primary animate-pulse" />
          <MapPin className="h-12 w-12 text-chart-2 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Interactive Map View</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Microsoft Planetary Computer satellite imagery will be displayed here
          </p>
          <div className="text-xs text-muted-foreground font-mono">
            Bangladesh Boundary: 88.0°E - 92.7°E, 20.5°N - 26.6°N
          </div>
        </div>
      </div>
    </Card>
  );
}
