import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Layers } from "lucide-react";
import { useState } from "react";

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  opacity: number;
}

interface LayerControlPanelProps {
  onLayerChange?: (layers: Layer[]) => void;
}

export function LayerControlPanel({ onLayerChange }: LayerControlPanelProps) {
  const [layers, setLayers] = useState<Layer[]>([
    { id: "sentinel2", name: "Sentinel-2 Optical", enabled: true, opacity: 100 },
    { id: "sentinel1", name: "Sentinel-1 SAR (Flood)", enabled: false, opacity: 80 },
    { id: "landcover", name: "Land Cover", enabled: false, opacity: 70 },
    { id: "floodzone", name: "Flood Risk Zones", enabled: true, opacity: 60 },
    { id: "cyclone", name: "Cyclone Paths", enabled: false, opacity: 70 },
    { id: "agriculture", name: "Agricultural Areas", enabled: false, opacity: 50 },
    { id: "urban", name: "Urban Development", enabled: false, opacity: 60 },
    { id: "forest", name: "Protected Forests", enabled: false, opacity: 65 },
    { id: "water", name: "Water Bodies", enabled: true, opacity: 70 },
    { id: "borders", name: "International Borders", enabled: true, opacity: 100 },
  ]);

  const handleToggle = (id: string) => {
    const updated = layers.map((layer) =>
      layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
    );
    setLayers(updated);
    onLayerChange?.(updated);
  };

  const handleOpacityChange = (id: string, value: number[]) => {
    const updated = layers.map((layer) =>
      layer.id === id ? { ...layer, opacity: value[0] } : layer
    );
    setLayers(updated);
    onLayerChange?.(updated);
  };

  return (
    <Card className="w-80" data-testid="panel-layer-control">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="h-4 w-4" />
          Map Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id={layer.id}
                checked={layer.enabled}
                onCheckedChange={() => handleToggle(layer.id)}
                data-testid={`checkbox-layer-${layer.id}`}
              />
              <Label htmlFor={layer.id} className="text-sm font-normal cursor-pointer flex-1">
                {layer.name}
              </Label>
            </div>
            {layer.enabled && (
              <div className="ml-6 flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Opacity:</span>
                <Slider
                  value={[layer.opacity]}
                  onValueChange={(value) => handleOpacityChange(layer.id, value)}
                  max={100}
                  step={5}
                  className="flex-1"
                  data-testid={`slider-opacity-${layer.id}`}
                />
                <span className="text-xs text-muted-foreground w-8">{layer.opacity}%</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
