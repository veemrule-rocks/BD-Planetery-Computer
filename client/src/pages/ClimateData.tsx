import { useQuery } from "@tanstack/react-query";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, CloudRain, Droplets } from "lucide-react";
import type { ClimateDataPoint } from "@shared/schema";

export default function ClimateData() {
  const { data: climateData = [], isLoading } = useQuery<ClimateDataPoint[]>({
    queryKey: ['/api/climate/data'],
  });

  const { data: districtData = [] } = useQuery<any[]>({
    queryKey: ['/api/districts/data'],
  });

  const columns = [
    { key: 'district', label: 'District', sortable: true },
    { key: 'division', label: 'Division', sortable: true },
    { key: 'waterLevel', label: 'Water Level (m)', sortable: true },
    { key: 'rainfall', label: 'Rainfall (mm)', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading climate data...</div>
      </div>
    );
  }

  const avgTemp = climateData.reduce((sum, d) => sum + d.temperature, 0) / climateData.length;
  const totalRainfall = climateData.reduce((sum, d) => sum + d.rainfall, 0);
  const avgHumidity = climateData.reduce((sum, d) => sum + (d.humidity || 0), 0) / climateData.length;

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div>
        <h1 className="text-2xl font-bold">Climate Data Analysis</h1>
        <p className="text-muted-foreground">Historical and current climate trends for Bangladesh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">2024 Annual Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rainfall</CardTitle>
            <CloudRain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRainfall.toFixed(0)}mm</div>
            <p className="text-xs text-muted-foreground mt-1">2024 Annual Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgHumidity.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">2024 Annual Average</p>
          </CardContent>
        </Card>
      </div>

      <TimeSeriesChart
        title="Climate Trends 2024"
        data={climateData}
        xKey="month"
        yKeys={[
          { key: 'temperature', label: 'Temperature (°C)', color: 'hsl(var(--chart-1))' },
          { key: 'rainfall', label: 'Rainfall (mm)', color: 'hsl(var(--chart-2))' },
        ]}
      />

      <DataTable
        columns={columns}
        data={districtData}
        onExport={() => {
          console.log('Exporting climate data...');
          const csvContent = [
            columns.map(c => c.label).join(','),
            ...districtData.map(row => columns.map(c => row[c.key]).join(','))
          ].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'bangladesh-climate-data.csv';
          a.click();
        }}
      />
    </div>
  );
}
