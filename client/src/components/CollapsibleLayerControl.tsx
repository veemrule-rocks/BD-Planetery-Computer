import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Layers } from "lucide-react";
import { useState } from "react";

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  opacity: number;
}

interface CollapsibleLayerControlProps {
  onLayerChange?: (layers: Layer[]) => void;
}

export function CollapsibleLayerControl({ onLayerChange }: CollapsibleLayerControlProps) {
  const [layers, setLayers] = useState<Layer[]>([
    { id: "sentinel2", name: "Sentinel-2 Optical", enabled: true, opacity: 100 },
    { id: "sentinel1", name: "Sentinel-1 SAR", enabled: false, opacity: 80 },
    { id: "landcover", name: "Land Cover", enabled: false, opacity: 70 },
    { id: "floodzone", name: "Flood Zones", enabled: true, opacity: 60 },
    { id: "cyclone", name: "Cyclone Paths", enabled: false, opacity: 70 },
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

  const activeCount = layers.filter(l => l.enabled).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm"
          className="gap-2 shadow-lg"
        >
          <Layers className="h-4 w-4" />
          Layers
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Map Layers</h4>
            <span className="text-xs text-muted-foreground">{activeCount} active</span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {layers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={layer.id}
                    checked={layer.enabled}
                    onCheckedChange={() => handleToggle(layer.id)}
                  />
                  <Label htmlFor={layer.id} className="text-sm font-normal cursor-pointer flex-1">
                    {layer.name}
                  </Label>
                </div>
                {layer.enabled && (
                  <div className="ml-6 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-14">Opacity</span>
                    <Slider
                      value={[layer.opacity]}
                      onValueChange={(value) => handleOpacityChange(layer.id, value)}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">{layer.opacity}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
