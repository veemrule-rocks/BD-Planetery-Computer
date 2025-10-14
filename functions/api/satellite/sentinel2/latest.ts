import { getLatestSentinel2 } from '../../../_shared/planetaryComputer';

export async function onRequest(context: any) {
  try {
    const imagery = await getLatestSentinel2();
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error fetching Sentinel-2 imagery:', error);
    return Response.json({ 
      error: 'Failed to fetch satellite imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}