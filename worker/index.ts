import { Hono } from 'hono';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const app = new Hono();

// Mock data functions
function getCurrentMetrics() {
  return [
    {
      id: '1',
      type: 'water_level',
      value: 6.2,
      unit: 'm',
      location: 'Brahmaputra River, Gazipur',
      district: 'Gazipur',
      division: 'Dhaka',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'caution',
      trend: { value: 12, direction: 'up' },
    },
    {
      id: '2',
      type: 'wind_speed',
      value: 45,
      unit: 'km/h',
      location: "Cox's Bazar",
      district: "Cox's Bazar",
      division: 'Chittagong',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'critical',
      trend: { value: 18, direction: 'up' },
    },
  ];
}

function getActiveAlerts() {
  return [
    {
      id: '1',
      severity: 'critical',
      type: 'Flood Warning',
      location: 'Gazipur District',
      district: 'Gazipur',
      division: 'Dhaka',
      description: 'Water level rising rapidly in Brahmaputra River.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      coordinates: { lat: 24.0, lon: 90.4 },
    },
  ];
}

function getClimateData(year: number = 2024) {
  return [
    { month: 'Jan', temperature: 18, rainfall: 12, humidity: 65 },
    { month: 'Feb', temperature: 20, rainfall: 25, humidity: 62 },
    { month: 'Mar', temperature: 25, rainfall: 45, humidity: 68 },
    { month: 'Apr', temperature: 28, rainfall: 120, humidity: 75 },
    { month: 'May', temperature: 30, rainfall: 280, humidity: 82 },
    { month: 'Jun', temperature: 31, rainfall: 420, humidity: 88 },
    { month: 'Jul', temperature: 31, rainfall: 380, humidity: 87 },
    { month: 'Aug', temperature: 30, rainfall: 320, humidity: 86 },
    { month: 'Sep', temperature: 29, rainfall: 240, humidity: 84 },
    { month: 'Oct', temperature: 27, rainfall: 180, humidity: 78 },
    { month: 'Nov', temperature: 23, rainfall: 50, humidity: 70 },
    { month: 'Dec', temperature: 19, rainfall: 15, humidity: 67 },
  ];
}

function getDistrictData() {
  return [
    { district: 'Dhaka', waterLevel: '5.2', rainfall: '145', status: 'Normal', division: 'Dhaka' },
    { district: 'Chittagong', waterLevel: '6.8', rainfall: '320', status: 'Caution', division: 'Chittagong' },
    { district: 'Sylhet', waterLevel: '7.5', rainfall: '450', status: 'Warning', division: 'Sylhet' },
  ];
}

function getRegionData(district: string) {
  const regions: Record<string, any> = {
    gazipur: {
      name: 'Gazipur',
      division: 'Dhaka',
      population: '5.2 million',
      riskLevel: 'high',
      waterLevel: '6.8m',
      rainfall: '145mm',
      alerts: 2,
    },
    dhaka: {
      name: 'Dhaka',
      division: 'Dhaka',
      population: '21.7 million',
      riskLevel: 'medium',
      waterLevel: '5.2m',
      rainfall: '98mm',
      alerts: 1,
    },
  };
  return regions[district.toLowerCase()] || null;
}

// API Routes
app.get('/api/alerts', (c) => {
  return c.json(getActiveAlerts());
});

app.get('/api/climate/data', (c) => {
  const yearParam = c.req.query('year');
  const year = yearParam ? parseInt(yearParam) : 2024;
  return c.json(getClimateData(year));
});

app.get('/api/districts/data', (c) => {
  return c.json(getDistrictData());
});

app.get('/api/metrics/current', (c) => {
  return c.json(getCurrentMetrics());
});

app.get('/api/region/:district', (c) => {
  const district = c.req.param('district');
  const data = getRegionData(district);
  if (!data) {
    return c.json({ error: 'District not found' }, 404);
  }
  return c.json(data);
});

app.get('/api/satellite/search', (c) => {
  return c.json({ message: 'Satellite API - Coming soon', features: [] });
});

app.get('/api/satellite/sentinel1/latest', (c) => {
  return c.json({ message: 'Sentinel-1 API - Coming soon', features: [] });
});

app.get('/api/satellite/sentinel2/latest', (c) => {
  return c.json({ message: 'Sentinel-2 API - Coming soon', features: [] });
});

// Handle all other routes - serve static assets from Workers Sites KV
app.get('*', async (c) => {
  try {
    return await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil: () => {},
      },
      {
        ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
      }
    );
  } catch (e) {
    // If asset not found, serve index.html for SPA routing
    try {
      return await getAssetFromKV(
        {
          request: new Request(new URL('/index.html', c.req.url).toString()),
          waitUntil: () => {},
        },
        {
          ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
        }
      );
    } catch (err) {
      return c.text('Not Found', 404);
    }
  }
});

export default app;
