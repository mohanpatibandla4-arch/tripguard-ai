import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPopularRoutes } from '../api/discover';
import type { PopularRoute } from '../types';
import { formatRoutesSubtitle, rotateRoutes, sessionRouteSeed } from '../utils/location';

interface PopularRoutesProps {
  originCode?: string;
  countryCode?: string;
  airportCity?: string;
  locationSource?: 'geolocation' | 'ip' | 'locale' | 'unknown';
}

export function PopularRoutes({
  originCode,
  countryCode,
  airportCity = 'your city',
  locationSource = 'unknown',
}: PopularRoutesProps) {
  const [routes, setRoutes] = useState<PopularRoute[]>([]);
  const [tab, setTab] = useState<'international' | 'domestic'>('international');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPopularRoutes(originCode, countryCode);
        const seed = sessionRouteSeed(originCode ?? 'global');
        setRoutes(rotateRoutes(data, seed));
      } catch {
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [originCode, countryCode]);

  const subtitle = formatRoutesSubtitle({ airportCity, source: locationSource });

  const cards = useMemo(() => {
    const pool =
      tab === 'international'
        ? routes.filter((r) => r.originCountry !== r.destinationCountry)
        : routes.filter((r) => r.originCountry === r.destinationCountry);
    return pool.slice(0, 8);
  }, [routes, tab]);

  const sectionTitle =
    locationSource === 'unknown' ? 'Popular international routes' : 'Popular flights near you';

  return (
    <section className="space-y-5">
      <div>
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="mt-1 text-ink-muted">{subtitle}</p>
      </div>

      <div className="flex gap-6 border-b border-border">
        {(['international', 'domestic'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`border-b-2 pb-3 text-sm font-semibold capitalize transition ${
              tab === key
                ? 'border-eu-blue text-eu-blue'
                : 'border-transparent text-ink-muted hover:text-eu-navy'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          No route suggestions for this filter yet. Try adding a trip manually.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((route, index) => (
            <motion.div
              key={`${route.originCode}-${route.destinationCode}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                to={`/bookings/new?from=${route.originCode}&to=${route.destinationCode}`}
                className="card-hover group block overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                title={`Book ${route.originCode} to ${route.destinationCode}`}
              >
                <div
                  className="h-32 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${route.imageUrl})` }}
                />
                <div className="p-4">
                  <p className="font-bold text-eu-navy">
                    {route.originCity} → {route.destinationCity}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {route.originCode} → {route.destinationCode} · {route.dateHint}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
