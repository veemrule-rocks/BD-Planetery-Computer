import axios from 'axios';
import type { SatelliteImagery } from '@shared/schema';

const STAC_API_URL = 'https://planetarycomputer.microsoft.com/api/stac/v1';

// Bangladesh bounding box: [minLon, minLat, maxLon, maxLat]
const BANGLADESH_BBOX = [88.0, 20.5, 92.7, 26.6];

interface STACSearchParams {
  collections: string[];
  bbox: number[];
  datetime: string;
  limit?: number;
  query?: Record<string, any>;
}

export async function searchSatelliteImagery(params: {
  collection: 'sentinel-2-l2a' | 'sentinel-1-grd' | 'landsat-c2-l2';
  startDate: string;
  endDate: string;
  cloudCover?: number;
  limit?: number;
}): Promise<SatelliteImagery[]> {
  try {
    const searchParams: STACSearchParams = {
      collections: [params.collection],
      bbox: BANGLADESH_BBOX,
      datetime: `${params.startDate}/${params.endDate}`,
      limit: params.limit || 10,
    };

    // Add cloud cover filter for optical imagery
    if (params.collection === 'sentinel-2-l2a' && params.cloudCover !== undefined) {
      searchParams.query = {
        'eo:cloud_cover': { lt: params.cloudCover },
      };
    }

    const response = await axios.post(`${STAC_API_URL}/search`, searchParams);

    return response.data.features || [];
  } catch (error) {
    console.error('Error fetching satellite imagery:', error);
    throw new Error('Failed to fetch satellite imagery from Planetary Computer');
  }
}

export async function getLatestSentinel2(): Promise<SatelliteImagery[]> {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return searchSatelliteImagery({
    collection: 'sentinel-2-l2a',
    startDate,
    endDate,
    cloudCover: 20,
    limit: 5,
  });
}

export async function getLatestSentinel1SAR(): Promise<SatelliteImagery[]> {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return searchSatelliteImagery({
    collection: 'sentinel-1-grd',
    startDate,
    endDate,
    limit: 5,
  });
}
