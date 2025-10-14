import { getLatestSentinel1SAR } from '../../../_shared/planetaryComputer';

export async function onRequest(context: any) {
  try {
    const imagery = await getLatestSentinel1SAR();
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error fetching Sentinel-1 SAR imagery:', error);
    return Response.json({ 
      error: 'Failed to fetch SAR imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}