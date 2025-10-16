import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon, LatLngExpression, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, EnvironmentalMetric } from '@shared/schema';
import { useEffect } from 'react';

interface InteractiveMapProps {
  alerts?: Alert[];
  metrics?: EnvironmentalMetric[];
  className?: string;
}

// Fix for default marker icon in Leaflet with Vite
const createCustomIcon = (color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 1.926.47 3.815 1.364 5.5L12.5 41l11.136-23c.894-1.685 1.364-3.574 1.364-5.5C25 5.596 19.404 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  safe: '#10b981',
  caution: '#f59e0b',
};

const getMetricIcon = (type: string) => {
  switch (type) {
    case 'water_level':
      return '💧';
    case 'wind_speed':
      return '💨';
    case 'temperature':
      return '🌡️';
    case 'rainfall':
      return '🌧️';
    default:
      return '📍';
  }
};

export function InteractiveMap({ alerts = [], metrics = [], className = '' }: InteractiveMapProps) {
  // Bangladesh center coordinates (Dhaka)
  const bangladeshCenter: LatLngExpression = [23.8103, 90.4125];
  
  // Define max bounds - roughly 1000km radius from Dhaka covering Bangladesh
  const maxBounds = new LatLngBounds(
    [20.5, 88.0],  // Southwest
    [26.6, 92.7]   // Northeast
  );

  useEffect(() => {
    // Fix Leaflet default marker icon paths
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjMzM4OGZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEyLjUgMEM1LjU5NiAwIDAgNS41OTYgMCAxMi41YzAgMS45MjYuNDcgMy44MTUgMS4zNjQgNS41TDEyLjUgNDFsMTEuMTM2LTIzYy44OTQtMS42ODUgMS4zNjQtMy41NzQgMS4zNjQtNS41QzI1IDUuNTk2IDE5LjQwNCAwIDEyLjUgMHoiLz48Y2lyY2xlIGZpbGw9IiNmZmYiIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iNiIvPjwvc3ZnPg==',
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjMzM4OGZmIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEyLjUgMEM1LjU5NiAwIDAgNS41OTYgMCAxMi41YzAgMS45MjYuNDcgMy44MTUgMS4zNjQgNS41TDEyLjUgNDFsMTEuMTM2LTIzYy44OTQtMS42ODUgMS4zNjQtMy41NzQgMS4zNjQtNS41QzI1IDUuNTk2IDE5LjQwNCAwIDEyLjUgMHoiLz48Y2lyY2xlIGZpbGw9IiNmZmYiIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iNiIvPjwvc3ZnPg==',
      shadowUrl: '',
    });
  }, []);

  return (
    <div className={`rounded-xl overflow-hidden border-2 shadow-xl ${className}`}>
      <MapContainer
        center={bangladeshCenter}
        zoom={7}
        minZoom={6}
        maxZoom={18}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
      >
        {/* Original OpenStreetMap tiles with Bengali names */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Alert Markers with Circles */}
        {alerts.map((alert) => {
          if (!alert.coordinates) return null;
          const color = severityColors[alert.severity] || severityColors.medium;
          const icon = createCustomIcon(color);
          const position: LatLngExpression = [alert.coordinates.lat, alert.coordinates.lon];

          return (
            <div key={alert.id}>
              <Circle
                center={position}
                radius={alert.severity === 'critical' ? 30000 : alert.severity === 'high' ? 20000 : 10000}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              />
              <Marker position={position} icon={icon}>
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-bold text-sm">{alert.type}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold">{alert.location}</p>
                      <p className="text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}

        {/* Metric Markers */}
        {metrics.map((metric) => {
          const districtCoords: Record<string, [number, number]> = {
            Dhaka: [23.8103, 90.4125],
            Gazipur: [24.0022, 90.4264],
            "Cox's Bazar": [21.4272, 92.0058],
            Sylhet: [24.8949, 91.8687],
            Chittagong: [22.3569, 91.7832],
          };

          const coords = districtCoords[metric.district] || bangladeshCenter;
          const color = severityColors[metric.severity || 'safe'];
          const position: LatLngExpression = coords;

          return (
            <Marker
              key={metric.id}
              position={position}
              icon={createCustomIcon(color)}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getMetricIcon(metric.type)}</span>
                    <span className="font-bold text-sm">
                      {metric.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-lg font-bold">
                      {metric.value} {metric.unit}
                    </p>
                    <p className="font-semibold">{metric.location}</p>
                    <p className="text-muted-foreground">{metric.district}, {metric.division}</p>
                    {metric.trend && (
                      <p className="text-xs">
                        Trend: {metric.trend.direction === 'up' ? '↑' : '↓'} {metric.trend.value}%
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(metric.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
