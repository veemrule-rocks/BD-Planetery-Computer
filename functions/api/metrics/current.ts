import { getCurrentMetrics } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const metrics = getCurrentMetrics();
    return Response.json(metrics);
  } catch (error: any) {
    console.error('Error fetching current metrics:', error);
    return Response.json({ 
      error: 'Failed to fetch metrics',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}