import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getBookings } from '../api/bookings';
import { Card } from '../components/Card';
import { FEATURE_DETAILS, FeatureDetailModal } from '../components/FeatureDetailModal';
import { LinkButton } from '../components/LinkButton';
import { PopularRoutes } from '../components/PopularRoutes';
import { BookingCardSkeleton, StatCardSkeleton } from '../components/Skeleton';
import { TripCard } from '../components/TripCard';
import { useUserOrigin } from '../hooks/useUserOrigin';
import type { Booking } from '../types';
import { getApiErrorMessage } from '../utils/apiError';

export function DashboardPage() {
  const { airportCode, countryCode, heroLabel, airportCity, source } = useUserOrigin();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFeature, setActiveFeature] = useState<(typeof FEATURE_DETAILS)[number] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setBookings(await getBookings());
      } catch (err) {
        const message = getApiErrorMessage(err, 'We could not load your trips right now.');
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === 'ACTIVE' || b.status === 'SCHEDULED').length;
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;
    return { total: bookings.length, active, cancelled };
  }, [bookings]);

  const recent = bookings.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eu-navy via-eu-blue to-eu-blue-light px-6 py-10 text-white shadow-xl shadow-eu-blue/20 sm:px-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-eu-yellow/20 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-eu-red/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <p className="text-sm font-semibold text-eu-yellow">{heroLabel}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your trips, guarded worldwide.</h1>
          <p className="mt-3 max-w-xl text-white/85">
            Stay ahead of delays, cancellations, and gate changes. Track your route from departure
            to arrival — everything about your trip, in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton to="/bookings/new" variant="ai" size="lg">
              + Add a booking
            </LinkButton>
            <LinkButton
              to="/bookings?tab=flights"
              variant="outline"
              size="lg"
              className="!border-white/40 !text-white hover:!bg-white/10"
            >
              View all trips
            </LinkButton>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {loading
          ? [0, 1, 2].map((i) => <StatCardSkeleton key={i} />)
          : [
              { label: 'Total trips', value: stats.total, accent: 'text-eu-blue' },
              { label: 'Upcoming / active', value: stats.active, accent: 'text-eu-yellow' },
              { label: 'Cancelled', value: stats.cancelled, accent: 'text-eu-red' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="!p-5">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`mt-1 text-3xl font-bold ${stat.accent}`}>{stat.value}</p>
                </Card>
              </motion.div>
            ))}
      </section>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      <PopularRoutes
        originCode={airportCode}
        countryCode={countryCode ?? undefined}
        airportCity={airportCity}
        locationSource={source}
      />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Recent trips</h2>
            <p className="mt-1 text-gray-500">Your latest bookings at a glance</p>
          </div>
          <LinkButton to="/bookings?tab=flights" variant="ghost" size="sm" className="!px-0 !text-eu-blue">
            See all →
          </LinkButton>
        </div>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : null}
        {!loading && recent.length === 0 ? (
          <Card>
            <p className="text-gray-500">No trips yet. Add a flight to start tracking status and updates.</p>
            <LinkButton to="/bookings/new" className="mt-4">
              Add your first flight
            </LinkButton>
          </Card>
        ) : null}
        {!loading && recent.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((booking, index) => (
              <TripCard key={booking.id} booking={booking} index={index} />
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="section-title">How TripGuard helps</h2>
        <p className="mt-1 text-gray-500">Tap a card to learn more</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FEATURE_DETAILS.map((feature, i) => (
            <motion.button
              key={feature.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveFeature(feature)}
              className="card-hover group h-full rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-eu-blue"
            >
              <span className="text-2xl">{feature.icon}</span>
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-eu-blue">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{feature.summary}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-eu-blue opacity-0 transition group-hover:opacity-100">
                Learn more →
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <FeatureDetailModal feature={activeFeature} onClose={() => setActiveFeature(null)} />
    </div>
  );
}
