import type { EnvironmentalMetric, Alert, RegionData, ClimateDataPoint } from '@shared/schema';

// Mock environmental data service
// NOTE: This uses structured mock data for demonstration purposes.
// TODO: In production, replace with real data sources:
// - Bangladesh Meteorological Department (BMD): https://dataportal.bmd.gov.bd/
// - Flood Forecasting & Warning Centre (FFWC): https://www.ffwc.gov.bd/
// - Bangladesh Open Data Portal: https://data.gov.bd/
// - World Bank Climate Change Knowledge Portal for Bangladesh

export function getCurrentMetrics(): EnvironmentalMetric[] {
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
      location: 'Cox\'s Bazar',
      district: 'Cox\'s Bazar',
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
    {
      id: '4',
      type: 'rainfall',
      value: 145,
      unit: 'mm',
      location: 'Sylhet',
      district: 'Sylhet',
      division: 'Sylhet',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: 'caution',
      trend: { value: 25, direction: 'up' },
    },
  ];
}

export function getActiveAlerts(): Alert[] {
  return [
    {
      id: '1',
      severity: 'critical',
      type: 'Flood Warning',
      location: 'Gazipur District',
      district: 'Gazipur',
      division: 'Dhaka',
      description: 'Water level rising rapidly in Brahmaputra River. Evacuation recommended for low-lying areas.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      coordinates: { lat: 24.0, lon: 90.4 },
    },
    {
      id: '2',
      severity: 'high',
      type: 'Cyclone Alert',
      location: 'Cox\'s Bazar',
      district: 'Cox\'s Bazar',
      division: 'Chittagong',
      description: 'Tropical cyclone approaching coastal areas. Wind speed 85 km/h expected within 24 hours.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 21.4, lon: 92.0 },
    },
    {
      id: '3',
      severity: 'medium',
      type: 'Heavy Rainfall',
      location: 'Sylhet Division',
      district: 'Sylhet',
      division: 'Sylhet',
      description: 'Continuous heavy rainfall expected for next 48 hours. Flash flood risk in hilly areas.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 24.9, lon: 91.9 },
    },
  ];
}

export function getRegionData(district: string): RegionData | null {
  const regions: Record<string, RegionData> = {
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
    chittagong: {
      name: 'Chittagong',
      division: 'Chittagong',
      population: '8.6 million',
      elevation: '15m above sea level',
      riskLevel: 'high',
      waterLevel: '6.5m',
      rainfall: '320mm',
      alerts: 3,
      coordinates: { lat: 22.3, lon: 91.8 },
    },
    sylhet: {
      name: 'Sylhet',
      division: 'Sylhet',
      population: '3.9 million',
      elevation: '25m above sea level',
      riskLevel: 'critical',
      waterLevel: '7.5m',
      rainfall: '450mm',
      alerts: 2,
      coordinates: { lat: 24.9, lon: 91.9 },
    },
    "cox's bazar": {
      name: "Cox's Bazar",
      division: 'Chittagong',
      population: '2.3 million',
      elevation: '3m above sea level',
      riskLevel: 'critical',
      waterLevel: '4.2m',
      rainfall: '380mm',
      alerts: 3,
      coordinates: { lat: 21.4, lon: 92.0 },
    },
  };

  return regions[district.toLowerCase()] || null;
}

export function getClimateData(year: number = 2024): ClimateDataPoint[] {
  // NOTE: This returns sample data for 2024
  // TODO: Integrate with Bangladesh Meteorological Department API or historical climate databases
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

export function getDistrictData() {
  return [
    { district: 'Dhaka', waterLevel: '5.2', rainfall: '145', status: 'Normal', division: 'Dhaka' },
    { district: 'Chittagong', waterLevel: '6.8', rainfall: '320', status: 'Caution', division: 'Chittagong' },
    { district: 'Sylhet', waterLevel: '7.5', rainfall: '450', status: 'Warning', division: 'Sylhet' },
    { district: 'Khulna', waterLevel: '4.9', rainfall: '98', status: 'Normal', division: 'Khulna' },
    { district: 'Rajshahi', waterLevel: '3.2', rainfall: '67', status: 'Normal', division: 'Rajshahi' },
    { district: 'Rangpur', waterLevel: '4.5', rainfall: '125', status: 'Normal', division: 'Rangpur' },
    { district: 'Barisal', waterLevel: '6.1', rainfall: '285', status: 'Caution', division: 'Barisal' },
    { district: 'Mymensingh', waterLevel: '5.8', rainfall: '210', status: 'Caution', division: 'Mymensingh' },
  ];
}
