import { searchSatelliteImagery } from '../../_shared/planetaryComputer';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const imagery = await searchSatelliteImagery(body);
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error searching satellite imagery:', error);
    return Response.json({ 
      error: 'Failed to search satellite imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}