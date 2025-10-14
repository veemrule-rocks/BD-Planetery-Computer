import { getRegionData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const district = context.params.district;
    const regionData = getRegionData(district);
    
    if (!regionData) {
      return Response.json({ 
        error: 'Region not found',
        message: `No data available for district: ${district}`
      }, { status: 404 });
    }
    
    return Response.json(regionData);
  } catch (error: any) {
    console.error('Error fetching region data:', error);
    return Response.json({ 
      error: 'Failed to fetch region data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}