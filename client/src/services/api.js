/**
 * API Service Layer - Railway Route Planner
 * 
 * Purpose:
 * Centralizes all HTTP network request configurations connecting the React client 
 * to the Node.js/Express backend API server.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all available stations from Express API
 * GET /api/stations
 */
export async function fetchStations() {
  try {
    const response = await fetch(`${API_BASE_URL}/stations`);
    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to retrieve stations');
    }
    return result.data;
  } catch (error) {
    console.error('API Error (fetchStations):', error);
    throw error;
  }
}

/**
 * Submit train route search query payload to Express API
 * POST /api/search
 * Payload: { source, destination, interchanges: [], buffer: 2 }
 */
export async function searchTrainRoutes(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error processing search request on server');
    }

    return result.data;
  } catch (error) {
    console.error('API Error (searchTrainRoutes):', error);
    throw error;
  }
}
