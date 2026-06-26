import { useEffect, useState } from 'react';
import { formatLocationLabel, getUserLocation, type UserLocation } from '../utils/location';

const INITIAL: UserLocation = {
  city: null,
  country: null,
  countryCode: null,
  airportCode: 'DXB',
  airportCity: 'Dubai',
  source: 'unknown',
  loading: true,
};

export function useUserOrigin(): UserLocation & { heroLabel: string } {
  const [state, setState] = useState<UserLocation>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    async function detect() {
      try {
        const location = await getUserLocation();
        if (!cancelled) {
          setState({ ...location, loading: false });
        }
      } catch {
        if (!cancelled) {
          setState({ ...INITIAL, loading: false });
        }
      }
    }
    void detect();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...state,
    heroLabel: state.loading ? 'Finding routes near you…' : formatLocationLabel(state),
  };
}
