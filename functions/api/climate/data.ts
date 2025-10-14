import { getClimateData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const url = new URL(context.request.url);
    const yearParam = url.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam) : 2024;
    
    if (isNaN(year) || year < 1950 || year > 2100) {
      return Response.json({
        error: 'Invalid year parameter',
        message: 'Year must be between 1950 and 2100'
      }, { status: 400 });
    }

    const climateData = getClimateData(year);
    return Response.json(climateData);
  } catch (error: any) {
    console.error('Error fetching climate data:', error);
    return Response.json({ 
      error: 'Failed to fetch climate data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}