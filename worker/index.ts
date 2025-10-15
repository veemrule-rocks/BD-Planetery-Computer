import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { getActiveAlerts, getClimateData, getDistrictData, getCurrentMetrics, getRegionData } from '../functions/_shared/environmentalData';
import { searchSatelliteImagery, getLatestSentinel2, getLatestSentinel1SAR } from '../functions/_shared/planetaryComputer';

const app = new Hono();

// API Routes
app.get('/api/alerts', (c) => {
  try {
    const alerts = getActiveAlerts();
    return c.json(alerts);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch alerts', message: error?.message }, 500);
  }
});

app.get('/api/climate/data', (c) => {
  try {
    const yearParam = c.req.query('year');
    const year = yearParam ? parseInt(yearParam) : 2024;
    
    if (isNaN(year) || year < 1950 || year > 2100) {
      return c.json({ error: 'Invalid year parameter', message: 'Year must be between 1950 and 2100' }, 400);
    }

    const climateData = getClimateData(year);
    return c.json(climateData);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch climate data', message: error?.message }, 500);
  }
});

app.get('/api/districts/data', (c) => {
  try {
    const districtData = getDistrictData();
    return c.json(districtData);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch district data', message: error?.message }, 500);
  }
});

app.get('/api/metrics/current', (c) => {
  try {
    const metrics = getCurrentMetrics();
    return c.json(metrics);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch current metrics', message: error?.message }, 500);
  }
});

app.get('/api/region/:district', (c) => {
  try {
    const district = c.req.param('district');
    const regionData = getRegionData(district);
    
    if (!regionData) {
      return c.json({ error: 'District not found', message: `No data available for ${district}` }, 404);
    }
    
    return c.json(regionData);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch region data', message: error?.message }, 500);
  }
});

app.get('/api/satellite/search', async (c) => {
  try {
    const collection = c.req.query('collection') || 'sentinel-2-l2a';
    const limit = parseInt(c.req.query('limit') || '10');
    const cloudCover = parseInt(c.req.query('cloudCover') || '20');
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const results = await searchSatelliteImagery({
      collection: collection as any,
      startDate,
      endDate,
      cloudCover,
      limit,
    });
    
    return c.json(results);
  } catch (error: any) {
    return c.json({ error: 'Failed to search satellite imagery', message: error?.message }, 500);
  }
});

app.get('/api/satellite/sentinel1/latest', async (c) => {
  try {
    const data = await getLatestSentinel1SAR();
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch Sentinel-1 data', message: error?.message }, 500);
  }
});

app.get('/api/satellite/sentinel2/latest', async (c) => {
  try {
    const data = await getLatestSentinel2();
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch Sentinel-2 data', message: error?.message }, 500);
  }
});

// Serve static assets
app.use('/assets/*', serveStatic({ root: './' }));
app.use('/*', serveStatic({ root: './' }));

// Fallback to index.html for SPA routing
app.get('*', serveStatic({ path: './index.html' }));

export default app;
