import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Satellite, Cloud, Calendar, Download } from "lucide-react";
import type { SatelliteImagery } from "@shared/schema";

export default function SatelliteImagery() {
  const { data: sentinel2Data = [], isLoading: loading2 } = useQuery<SatelliteImagery[]>({
    queryKey: ['/api/satellite/sentinel2/latest'],
  });

  const { data: sentinel1Data = [], isLoading: loading1 } = useQuery<SatelliteImagery[]>({
    queryKey: ['/api/satellite/sentinel1/latest'],
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div>
        <h1 className="text-2xl font-bold">Satellite Imagery</h1>
        <p className="text-muted-foreground">Latest satellite data from Microsoft Planetary Computer</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Sentinel-2 Optical Imagery
          </h2>
          {loading2 ? (
            <div className="text-muted-foreground">Loading Sentinel-2 data...</div>
          ) : sentinel2Data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentinel2Data.map((item: any, idx) => (
                <Card key={item.id || idx} data-testid={`card-sentinel2-${idx}`}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span className="truncate">Scene {idx + 1}</span>
                      <Badge variant="secondary" className="text-xs">
                        Sentinel-2
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(item.properties?.datetime || item.datetime)}</span>
                    </div>
                    {item.properties?.['eo:cloud_cover'] !== undefined && (
                      <div className="flex items-center gap-2 text-sm">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        <span>Cloud Cover: {item.properties['eo:cloud_cover'].toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          console.log('View imagery:', item);
                        }}
                        data-testid={`button-view-sentinel2-${idx}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View Imagery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No Sentinel-2 imagery available
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Sentinel-1 SAR (Flood Detection)
          </h2>
          {loading1 ? (
            <div className="text-muted-foreground">Loading Sentinel-1 SAR data...</div>
          ) : sentinel1Data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentinel1Data.map((item: any, idx) => (
                <Card key={item.id || idx} data-testid={`card-sentinel1-${idx}`}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span className="truncate">SAR Scene {idx + 1}</span>
                      <Badge variant="secondary" className="text-xs bg-chart-2/20">
                        Sentinel-1
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(item.properties?.datetime || item.datetime)}</span>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          console.log('View SAR imagery:', item);
                        }}
                        data-testid={`button-view-sentinel1-${idx}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View SAR Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No Sentinel-1 SAR imagery available
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
