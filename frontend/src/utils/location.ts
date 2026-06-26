import { getNearestAirport } from '../api/discover';

export interface AirportHub {
  code: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

export interface UserLocation {
  city: string | null;
  country: string | null;
  countryCode: string | null;
  airportCode: string;
  airportCity: string;
  source: 'geolocation' | 'ip' | 'locale' | 'unknown';
  loading: boolean;
}

/** Major hubs used for nearest-airport resolution */
export const AIRPORT_HUBS: AirportHub[] = [
  { code: 'DEL', city: 'New Delhi', country: 'India', countryCode: 'IN', lat: 28.5562, lon: 77.1 },
  { code: 'HYD', city: 'Hyderabad', country: 'India', countryCode: 'IN', lat: 17.24, lon: 78.43 },
  { code: 'VGA', city: 'Vijayawada', country: 'India', countryCode: 'IN', lat: 16.53, lon: 80.8 },
  { code: 'VTZ', city: 'Visakhapatnam', country: 'India', countryCode: 'IN', lat: 17.72, lon: 83.22 },
  { code: 'BLR', city: 'Bangalore', country: 'India', countryCode: 'IN', lat: 12.97, lon: 77.59 },
  { code: 'BOM', city: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.09, lon: 72.87 },
  { code: 'MAA', city: 'Chennai', country: 'India', countryCode: 'IN', lat: 12.99, lon: 80.17 },
  { code: 'LHR', city: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.47, lon: -0.45 },
  { code: 'JFK', city: 'New York', country: 'United States', countryCode: 'US', lat: 40.64, lon: -73.78 },
  { code: 'DXB', city: 'Dubai', country: 'UAE', countryCode: 'AE', lat: 25.25, lon: 55.36 },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.36, lon: 103.99 },
  { code: 'HEL', city: 'Helsinki', country: 'Finland', countryCode: 'FI', lat: 60.32, lon: 24.96 },
  { code: 'CDG', city: 'Paris', country: 'France', countryCode: 'FR', lat: 49.01, lon: 2.55 },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', lat: 50.04, lon: 8.56 },
  { code: 'SYD', city: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.95, lon: 151.18 },
  { code: 'KTM', city: 'Kathmandu', country: 'Nepal', countryCode: 'NP', lat: 27.7, lon: 85.36 },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

export function getNearestAirportFromCoords(lat: number, lon: number): AirportHub {
  let best = AIRPORT_HUBS[0];
  let bestDist = Infinity;
  for (const hub of AIRPORT_HUBS) {
    const d = haversineKm(lat, lon, hub.lat, hub.lon);
    if (d < bestDist) {
      bestDist = d;
      best = hub;
    }
  }
  return best;
}

export function getHubByCode(code: string): AirportHub | undefined {
  return AIRPORT_HUBS.find((h) => h.code === code.toUpperCase());
}

function localeCountryCode(): string | null {
  const locale = navigator.language;
  const match = locale.match(/-([A-Z]{2})$/i);
  return match ? match[1].toUpperCase() : null;
}

function browserGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300_000,
    });
  });
}

async function ipLookup(): Promise<{ city?: string; country?: string; countryCode?: string } | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as {
      city?: string;
      country_name?: string;
      country_code?: string;
    };
    return {
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code,
    };
  } catch {
    return null;
  }
}

export async function getUserLocation(): Promise<Omit<UserLocation, 'loading'>> {
  try {
    const pos = await browserGeolocation();
    const hub = getNearestAirportFromCoords(pos.coords.latitude, pos.coords.longitude);
    return {
      city: hub.city,
      country: hub.country,
      countryCode: hub.countryCode,
      airportCode: hub.code,
      airportCity: hub.city,
      source: 'geolocation',
    };
  } catch {
    // continue to fallbacks
  }

  const ip = await ipLookup();
  if (ip?.countryCode) {
    const airportCode = await getNearestAirport(ip.countryCode);
    const hub = getHubByCode(airportCode);
    return {
      city: ip.city ?? hub?.city ?? null,
      country: ip.country ?? hub?.country ?? null,
      countryCode: ip.countryCode,
      airportCode,
      airportCity: hub?.city ?? ip.city ?? airportCode,
      source: 'ip',
    };
  }

  const localeCc = localeCountryCode();
  if (localeCc) {
    try {
      const airportCode = await getNearestAirport(localeCc);
      const hub = getHubByCode(airportCode);
      return {
        city: hub?.city ?? null,
        country: hub?.country ?? null,
        countryCode: localeCc,
        airportCode,
        airportCity: hub?.city ?? airportCode,
        source: 'locale',
      };
    } catch {
      // fall through
    }
  }

  return {
    city: null,
    country: null,
    countryCode: null,
    airportCode: 'DXB',
    airportCity: 'Dubai',
    source: 'unknown',
  };
}

export function formatLocationLabel(location: Pick<UserLocation, 'city' | 'country' | 'source'>): string {
  if (location.city) {
    return `Flights near ${location.city}`;
  }
  if (location.country) {
    return `Popular flights in ${location.country}`;
  }
  return 'Popular routes worldwide';
}

export function formatRoutesSubtitle(location: Pick<UserLocation, 'airportCity' | 'source'>): string {
  if (location.source === 'unknown') {
    return 'Hand-picked international routes — set your location for nearby suggestions.';
  }
  return `Suggested departures from ${location.airportCity}`;
}

/** Stable session seed for route rotation */
export function sessionRouteSeed(airportCode: string): number {
  const key = `tg-route-seed-${airportCode}`;
  const existing = sessionStorage.getItem(key);
  if (existing) {
    return Number(existing);
  }
  const seed = Math.floor(Math.random() * 10_000);
  sessionStorage.setItem(key, String(seed));
  return seed;
}

export function rotateRoutes<T>(items: T[], seed: number): T[] {
  if (items.length <= 1) {
    return items;
  }
  const offset = seed % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
