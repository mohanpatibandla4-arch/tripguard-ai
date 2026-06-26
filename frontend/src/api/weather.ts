import { apiClient } from './client';
import type { WeatherResponse } from '../types';

export async function getDestinationWeather(airport: string): Promise<WeatherResponse> {
  const { data } = await apiClient.get<WeatherResponse>('/discover/weather', {
    params: { airport },
  });
  return data;
}
