import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Mock data functions
function getCurrentMetrics() {
  return [
    { id: '1', type: 'water_level', value: 6.2, unit: 'm', location: 'Brahmaputra River, Gazipur', district: 'Gazipur', severity: 'caution' },
    { id: '2', type: 'wind_speed', value: 45, unit: 'km/h', location: "Cox's Bazar", district: "Cox's Bazar", severity: 'critical' },
    { id: '3', type: 'temperature', value: 32, unit: '°C', location: 'Dhaka', district: 'Dhaka', severity: 'safe' },
  ];
}

function getActiveAlerts() {
  return [
    { id: '1', severity: 'critical', type: 'Flood Warning', location: 'Gazipur District', description: 'Water level rising rapidly' },
    { id: '2', severity: 'high', type: 'Cyclone Alert', location: "Cox's Bazar", description: 'Tropical cyclone approaching' },
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
  ];
}

function getRegionData(district: string) {
  const regions: Record<string, any> = {
    gazipur: { name: 'Gazipur', population: '5.2 million', riskLevel: 'high', waterLevel: '6.8m' },
    dhaka: { name: 'Dhaka', population: '21.7 million', riskLevel: 'medium', waterLevel: '5.2m' },
  };
  return regions[district.toLowerCase()] || null;
}

// API Router
async function handleAPIRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // API Routes
  if (path === '/api/alerts') {
    return new Response(JSON.stringify(getActiveAlerts()), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (path === '/api/climate/data') {
    const year = parseInt(url.searchParams.get('year') || '2024');
    return new Response(JSON.stringify(getClimateData(year)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (path === '/api/districts/data') {
    return new Response(JSON.stringify(getDistrictData()), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (path === '/api/metrics/current') {
    return new Response(JSON.stringify(getCurrentMetrics()), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (path.startsWith('/api/region/')) {
    const district = path.split('/api/region/')[1];
    const data = getRegionData(district);
    if (!data) {
      return new Response(JSON.stringify({ error: 'District not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (path.startsWith('/api/satellite/')) {
    return new Response(JSON.stringify({ message: 'Satellite API - Coming soon', features: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('API endpoint not found', { status: 404 });
}

// Main fetch handler
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPIRequest(request);
    }

    // Serve static assets from Workers Sites
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
        }
      );
    } catch (e) {
      // If asset not found, try serving index.html for SPA routing
      try {
        const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
        return await getAssetFromKV(
          {
            request: indexRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
          }
        );
      } catch (err) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};
