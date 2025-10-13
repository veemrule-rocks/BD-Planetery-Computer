# Bangladesh Environmental Monitoring Dashboard

## Overview
A comprehensive government environmental monitoring dashboard for Bangladesh, utilizing Microsoft Planetary Computer API as the primary data source. The application provides real-time satellite imagery, climate data analysis, flood monitoring, and regional border analysis.

## Purpose
This dashboard serves the Bangladesh government's need to monitor environmental conditions, natural disasters, and climate impacts across the country. It integrates satellite data from Microsoft Planetary Computer with environmental monitoring to provide actionable insights for disaster management and policy planning.

## Current State
**Status:** MVP Complete - Core functionality implemented with real satellite API integration

### Implemented Features
- ✅ Interactive dashboard with real-time environmental metrics
- ✅ Microsoft Planetary Computer STAC API integration (Sentinel-2 and Sentinel-1)
- ✅ Environmental monitoring displays (flood, climate, alerts)
- ✅ Multiple specialized pages (Dashboard, Flood Monitoring, Climate Data, Satellite Imagery)
- ✅ Professional government-appropriate design with Bangladesh colors
- ✅ Dark/light theme support
- ✅ Responsive layout with sidebar navigation
- ✅ Data visualization with charts and tables

### Data Sources
**Active Integrations:**
- Microsoft Planetary Computer STAC API
  - Sentinel-2 L2A (Optical imagery, 10-60m resolution)
  - Sentinel-1 GRD (SAR for flood detection)
  - Bangladesh bounding box: 88.0°E to 92.7°E, 20.5°N to 26.6°N

**Mock Data (To be replaced in production):**
- Environmental metrics (water levels, temperature, rainfall, wind speed)
- Alerts and warnings
- District-level data
- Climate trends

**Future Integration Targets:**
- Bangladesh Meteorological Department (BMD): https://dataportal.bmd.gov.bd/
- Flood Forecasting & Warning Centre (FFWC): https://www.ffwc.gov.bd/
- Bangladesh Open Data Portal: https://data.gov.bd/
- World Bank Climate Change Knowledge Portal

## Recent Changes
- **2025-01-13:** Initial implementation of dashboard with Microsoft Planetary Computer integration
  - Created backend API routes with Zod validation
  - Implemented satellite imagery search and retrieval
  - Built frontend components for data visualization
  - Added multiple dashboard pages with real-time data
  - Integrated environmental monitoring displays

## Project Architecture

### Technology Stack
**Frontend:**
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI + Tailwind CSS
- Recharts for data visualization
- Date-fns for date handling

**Backend:**
- Express.js
- TypeScript
- Axios for external API calls
- Zod for validation
- In-memory storage (no database needed for monitoring dashboard)

### Key Components
- `MapPlaceholder`: Placeholder for satellite imagery map view
- `MetricCard`: Displays environmental metrics with severity indicators
- `AlertCard`: Shows environmental alerts with priority levels
- `TimeSeriesChart`: Climate and environmental data visualization
- `LayerControlPanel`: Map layer controls for satellite data
- `RegionDetailPanel`: Detailed district-level information
- `DateRangeSelector`: Time range selection for historical data

### API Routes
```
GET  /api/satellite/sentinel2/latest     - Latest Sentinel-2 optical imagery
GET  /api/satellite/sentinel1/latest     - Latest Sentinel-1 SAR imagery  
POST /api/satellite/search               - Search satellite imagery with filters
GET  /api/metrics/current                - Current environmental metrics
GET  /api/alerts                         - Active environmental alerts
GET  /api/region/:district               - District-specific data
GET  /api/climate/data                   - Climate trend data
GET  /api/districts/data                 - All districts overview
```

## Data Model

### Schema Definitions (shared/schema.ts)
- `SatelliteImagery`: STAC-compliant satellite data
- `SatelliteSearch`: Search parameters with validation
- `EnvironmentalMetric`: Water levels, temperature, rainfall, wind
- `Alert`: Environmental warnings and alerts
- `RegionData`: District-level information
- `ClimateDataPoint`: Historical climate data

## User Preferences
- Default theme: Dark mode (suitable for extended monitoring sessions)
- Bangladesh national colors used for branding (green: #1a7a46, red: #d32f2f)
- IBM Plex Sans for UI, IBM Plex Mono for data/coordinates
- Professional government aesthetic with data clarity focus

## Next Phase Enhancements
1. **Map Implementation:** Replace placeholder with actual satellite imagery viewer (Leaflet/MapLibre)
2. **Live Data Integration:** Connect to real Bangladesh government APIs (BMD, FFWC)
3. **Predictive Analytics:** CMIP6 climate projections and forecasting
4. **Alert System:** Real-time notifications for critical events
5. **Cross-border Analysis:** Shared basin monitoring with India, Myanmar
6. **Export Features:** PDF report generation for government use

## Environment Configuration
- No API key required for Microsoft Planetary Computer (free tier)
- For production: Set `PC_SDK_SUBSCRIPTION_KEY` for higher rate limits

## Development Notes
- Uses in-memory storage pattern (MemStorage) - no database required for monitoring dashboard
- Follows fullstack_js blueprint conventions
- All timestamps in ISO 8601 format
- Bangladesh-centric coordinates and district names throughout
- Error handling with typed responses and Zod validation
