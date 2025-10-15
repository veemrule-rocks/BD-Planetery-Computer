import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import manifest from '__STATIC_CONTENT_MANIFEST';

const app = new Hono();

// Type definitions for request context
type Env = {
  __STATIC_CONTENT: any;
};

// Mock data functions (inline to avoid import issues)
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
    {
      id: '3',
      type: 'temperature',
      value: 32,
      unit: '°C',
      location: 'Dhaka',
      district: 'Dhaka',
      division: 'Dhaka',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      severity: 'safe',
      trend: { value: 3, direction: 'down' },
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
    {
      id: '2',
      severity: 'high',
      type: 'Cyclone Alert',
      location: "Cox's Bazar",
      district: "Cox's Bazar",
      division: 'Chittagong',
      description: 'Tropical cyclone approaching coastal areas.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 21.4, lon: 92.0 },
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
    { district: 'Khulna', waterLevel: '4.9', rainfall: '98', status: 'Normal', division: 'Khulna' },
  ];
}

function getRegionData(district: string) {
  const regions: Record<string, any> = {
    gazipur: {
      name: 'Gazipur',
      division: 'Dhaka',
      population: '5.2 million',
      elevation: '8m above sea level',
      riskLevel: 'high',
      waterLevel: '6.8m',
      rainfall: '145mm',
      alerts: 2,
      coordinates: { lat: 24.0, lon: 90.4 },
    },
    dhaka: {
      name: 'Dhaka',
      division: 'Dhaka',
      population: '21.7 million',
      elevation: '6m above sea level',
      riskLevel: 'medium',
      waterLevel: '5.2m',
      rainfall: '98mm',
      alerts: 1,
      coordinates: { lat: 23.8, lon: 90.4 },
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

app.get('/api/satellite/search', async (c) => {
  return c.json({ 
    message: 'Satellite data API - Coming soon',
    features: [] 
  });
});

app.get('/api/satellite/sentinel1/latest', async (c) => {
  return c.json({ 
    message: 'Sentinel-1 data - Coming soon',
    features: [] 
  });
});

app.get('/api/satellite/sentinel2/latest', async (c) => {
  return c.json({ 
    message: 'Sentinel-2 data - Coming soon',
    features: [] 
  });
});

// Static file serving with proper Workers Sites integration
app.get('*', async (c) => {
  try {
    const env = c.env as Env;
    const url = new URL(c.req.url);
    let path = url.pathname;
    
    // Default to index.html for SPA routes
    if (path === '/' || !path.includes('.')) {
      path = '/index.html';
    }
    
    // Get the asset from KV
    const assetKey = path.replace(/^\//, '');
    const asset = await env.__STATIC_CONTENT.get(assetKey, { type: 'arrayBuffer' });
    
    if (!asset) {
      // Fallback to index.html for client-side routing
      const indexAsset = await env.__STATIC_CONTENT.get('index.html', { type: 'arrayBuffer' });
      if (indexAsset) {
        return new Response(indexAsset, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
      return c.text('Not Found', 404);
    }
    
    // Determine content type
    const contentType = 
      path.endsWith('.html') ? 'text/html' :
      path.endsWith('.js') ? 'application/javascript' :
      path.endsWith('.css') ? 'text/css' :
      path.endsWith('.json') ? 'application/json' :
      path.endsWith('.png') ? 'image/png' :
      path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg' :
      path.endsWith('.svg') ? 'image/svg+xml' :
      'application/octet-stream';
    
    return new Response(asset, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': path.includes('assets/') ? 'public, max-age=31536000' : 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error serving static file:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default app;
