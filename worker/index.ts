import { Hono } from 'hono';

type Env = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

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
    {
      id: '3',
      type: 'temperature',
      value: 32,
      unit: '°C',
      location: 'Dhaka City',
      district: 'Dhaka',
      division: 'Dhaka',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severity: 'safe',
      trend: { value: 5, direction: 'up' },
    },
    {
      id: '4',
      type: 'rainfall',
      value: 145,
      unit: 'mm',
      location: 'Sylhet',
      district: 'Sylhet',
      division: 'Sylhet',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      severity: 'caution',
      trend: { value: 22, direction: 'up' },
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
      description: 'Water level rising rapidly in Brahmaputra River. Residents advised to move to higher ground.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 24.0022, lon: 90.4264 },
    },
    {
      id: '2',
      severity: 'high',
      type: 'Cyclone Alert',
      location: "Cox's Bazar",
      district: "Cox's Bazar",
      division: 'Chittagong',
      description: 'Tropical cyclone approaching coastal areas. Strong winds expected within 24 hours.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 21.4272, lon: 92.0058 },
    },
    {
      id: '3',
      severity: 'medium',
      type: 'Heat Advisory',
      location: 'Rajshahi',
      district: 'Rajshahi',
      division: 'Rajshahi',
      description: 'Extreme heat conditions expected. Stay hydrated and avoid outdoor activities during peak hours.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 24.3745, lon: 88.6042 },
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
    { district: 'Dhaka', waterLevel: '5.2', rainfall: '145', status: 'Normal' },
    { district: 'Chittagong', waterLevel: '6.8', rainfall: '320', status: 'Caution' },
    { district: 'Sylhet', waterLevel: '7.5', rainfall: '450', status: 'Warning' },
    { district: 'Rajshahi', waterLevel: '4.8', rainfall: '98', status: 'Normal' },
    { district: 'Khulna', waterLevel: '5.9', rainfall: '210', status: 'Normal' },
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
      elevation: '11m',
      rainfall: '145mm',
      alerts: 2,
      coordinates: { lat: 24.0022, lon: 90.4264 },
      vulnerableAreas: ['Tongi', 'Kaliakair', 'Kapasia'],
    },
    dhaka: {
      name: 'Dhaka',
      division: 'Dhaka',
      population: '21.7 million',
      riskLevel: 'medium',
      waterLevel: '5.2m',
      elevation: '4m',
      rainfall: '98mm',
      alerts: 1,
      coordinates: { lat: 23.8103, lon: 90.4125 },
      vulnerableAreas: ['Mirpur', 'Demra', 'Kamrangirchar'],
    },
    chittagong: {
      name: 'Chittagong',
      division: 'Chittagong',
      population: '8.3 million',
      riskLevel: 'high',
      waterLevel: '6.8m',
      elevation: '5m',
      rainfall: '320mm',
      alerts: 1,
      coordinates: { lat: 22.3569, lon: 91.7832 },
      vulnerableAreas: ['Patenga', 'Halishahar', 'Agrabad'],
    },
    sylhet: {
      name: 'Sylhet',
      division: 'Sylhet',
      population: '3.5 million',
      riskLevel: 'critical',
      waterLevel: '7.5m',
      elevation: '21m',
      rainfall: '450mm',
      alerts: 3,
      coordinates: { lat: 24.8949, lon: 91.8687 },
      vulnerableAreas: ['Sunamganj', 'Sylhet Sadar', 'Companiganj'],
    },
  };
  return regions[district.toLowerCase()] || null;
}

// API Routes
app.get('/api/alerts', (c) => {
  return c.json(getActiveAlerts());
});

app.get('/api/climate/data', (c) => {
  const year = parseInt(c.req.query('year') || '2024');
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

app.get('/api/satellite/:feature', (c) => {
  const feature = c.req.param('feature');
  return c.json({
    message: 'Satellite API - Coming soon',
    feature: feature,
    status: 'development',
  });
});

// Serve static assets - fallback to ASSETS binding
app.get('*', async (c) => {
  // Try to fetch from ASSETS binding
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
  
  // If asset is found, return it
  if (assetResponse.status !== 404) {
    return assetResponse;
  }
  
  // If not found, try to serve index.html for SPA routing
  const url = new URL(c.req.url);
  url.pathname = '/index.html';
  const indexResponse = await c.env.ASSETS.fetch(url.toString());
  
  return indexResponse;
});

export default app;
