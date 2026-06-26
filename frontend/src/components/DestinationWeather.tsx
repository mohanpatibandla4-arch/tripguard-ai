import { useEffect, useState } from 'react';
import { getDestinationWeather } from '../api/weather';
import type { WeatherResponse } from '../types';
import { getApiErrorMessage } from '../utils/apiError';

interface DestinationWeatherProps {
  airportCode: string;
}

function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '☁️';
}

export function DestinationWeather({ airportCode }: DestinationWeatherProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getDestinationWeather(airportCode);
        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Weather unavailable'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [airportCode]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Destination weather</p>
        <div className="mt-4 skeleton h-16 rounded-xl" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
        Destination weather not available for {airportCode}.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Destination weather</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-4xl" aria-hidden>
            {weatherIcon(weather.weatherCode)}
          </span>
          <div>
            <p className="text-lg font-bold text-gray-900">{weather.condition}</p>
            <p className="mt-0.5 text-sm text-gray-500">{weather.summary}</p>
            <p className="mt-2 text-xs text-gray-400">
              {weather.city}
              {weather.country ? ` · ${weather.country}` : ''}
            </p>
          </div>
        </div>
        <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-gray-900">
          {Math.round(weather.temperatureC)}°C
        </p>
      </div>
    </div>
  );
}
