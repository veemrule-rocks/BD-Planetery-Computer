import { getDistrictData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const districtData = getDistrictData();
    return Response.json(districtData);
  } catch (error: any) {
    console.error('Error fetching district data:', error);
    return Response.json({ 
      error: 'Failed to fetch district data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}