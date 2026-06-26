import { apiClient } from './client';
import type { Airport, PopularRoute } from '../types';

export async function searchAirports(q = ''): Promise<Airport[]> {
  const { data } = await apiClient.get<Airport[]>('/discover/airports', {
    params: { q, limit: 40 },
  });
  return data;
}

export async function getPopularRoutes(origin?: string, countryCode?: string): Promise<PopularRoute[]> {
  const { data } = await apiClient.get<PopularRoute[]>('/discover/popular-routes', {
    params: { origin, countryCode },
  });
  return data;
}

export async function getNearestAirport(countryCode: string): Promise<string> {
  const { data } = await apiClient.get<{ airportCode: string }>('/discover/nearest-airport', {
    params: { countryCode },
  });
  return data.airportCode;
}
