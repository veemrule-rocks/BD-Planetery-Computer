import { getActiveAlerts } from '../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const alerts = getActiveAlerts();
    return Response.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return Response.json({ 
      error: 'Failed to fetch alerts',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}