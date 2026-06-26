import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  getBookingById,
  getFlightStatusEvents,
  trackFlightStatus,
} from '../api/bookings';
import { getNotifications } from '../api/notifications';
import { AnimatedButton } from '../components/AnimatedButton';
import { BookingFlowStepper } from '../components/BookingFlowStepper';
import { Card } from '../components/Card';
import { DestinationWeather } from '../components/DestinationWeather';
import { FlightStatusPanel } from '../components/FlightStatusPanel';
import { FlightTimeline } from '../components/FlightTimeline';
import { NotificationLog } from '../components/NotificationLog';
import { StatusBadge } from '../components/StatusBadge';
import { TimelineSkeleton } from '../components/Skeleton';
import type { Booking, FlightStatusEvent, NotificationAttempt } from '../types';
import { formatDateTime } from '../utils/format';
import { getApiErrorMessage } from '../utils/apiError';
import { routeGradient } from '../utils/routeVisual';

export function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [events, setEvents] = useState<FlightStatusEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState('');
  const autoTrackedRef = useRef(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [bookingResult, statusResult, notificationResult] = await Promise.allSettled([
        getBookingById(id),
        getFlightStatusEvents(id),
        getNotifications(id),
      ]);

      if (bookingResult.status === 'fulfilled') {
        setBooking(bookingResult.value);
      } else {
        setBooking(null);
        throw bookingResult.reason;
      }

      setEvents(statusResult.status === 'fulfilled' ? statusResult.value : []);
      setNotifications(notificationResult.status === 'fulfilled' ? notificationResult.value : []);

      if (statusResult.status === 'rejected') {
        toast.error(getApiErrorMessage(statusResult.reason, 'Could not load flight timeline.'));
      }
      if (notificationResult.status === 'rejected') {
        toast.error(getApiErrorMessage(notificationResult.reason, 'Could not load alerts.'));
      }

      return statusResult.status === 'fulfilled' ? statusResult.value : [];
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to load booking details.');
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleTrack = useCallback(async (silent = false) => {
    if (!id) {
      return;
    }
    setTracking(true);
    setError('');
    try {
      const event = await trackFlightStatus(id);
      await loadData();
      if (!silent) {
        toast.success(`Status updated: ${event.status.replace(/_/g, ' ')}`);
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to track flight status.');
      setError(message);
      toast.error(message);
    } finally {
      setTracking(false);
    }
  }, [id, loadData]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!id || loading || autoTrackedRef.current) {
      return;
    }
    if (events.length === 0 && booking) {
      autoTrackedRef.current = true;
      void handleTrack(true);
    }
  }, [id, loading, events.length, booking, handleTrack]);

  if (loading) {
    return (
      <div className="space-y-8">
        <BookingFlowStepper />
        <div className="skeleton h-40 rounded-3xl" />
        <TimelineSkeleton />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-4">
        <BookingFlowStepper />
        <p className="text-rose-600">{error || 'Booking not found.'}</p>
        <Link to="/bookings" className="font-medium text-emerald-700 hover:text-emerald-800">
          ← Back to trips
        </Link>
      </div>
    );
  }

  const gradient = routeGradient(booking.departureAirport, booking.arrivalAirport);
  const latestEvent = events.length > 0
    ? [...events].sort((a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime())[0]
    : null;

  return (
    <div className="space-y-8">
      <BookingFlowStepper />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} px-6 py-8 text-white shadow-lg sm:px-8`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/bookings?tab=tracking" className="text-sm font-medium text-white/80 hover:text-white">
              ← Back to tracking
            </Link>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
              {booking.flightNumber}
            </h1>
            <p className="mt-2 text-lg text-white/90">
              {booking.departureAirport} → {booking.arrivalAirport}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={booking.status} size="md" />
              {latestEvent ? <StatusBadge status={latestEvent.status} size="md" /> : null}
              {tracking ? (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                  Refreshing live data…
                </span>
              ) : null}
            </div>
          </div>
          <AnimatedButton
            variant="secondary"
            size="lg"
            onClick={() => void handleTrack()}
            disabled={tracking}
            className="shrink-0"
          >
            {tracking ? 'Tracking...' : '⟳ Track status'}
          </AnimatedButton>
        </div>
      </motion.div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      <FlightStatusPanel booking={booking} event={latestEvent} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DestinationWeather airportCode={booking.arrivalAirport} />
        <Card title="Flight performance" subtitle="Based on latest status check">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">On-time likelihood</span>
              <span className="font-bold text-emerald-700">
                {latestEvent?.status === 'DELAYED' ? '60%' : '80%'}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: latestEvent?.status === 'DELAYED' ? '60%' : '80%' }}
              />
            </div>
            <p className="text-xs text-gray-400">Demo metric — connect Aviationstack for real history.</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card title="Trip summary">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-gray-50 pb-3">
                <dt className="text-gray-500">Departure</dt>
                <dd className="text-right font-medium text-gray-900">
                  {formatDateTime(booking.scheduledDeparture)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 pb-3">
                <dt className="text-gray-500">Arrival</dt>
                <dd className="text-right font-medium text-gray-900">
                  {formatDateTime(booking.scheduledArrival)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-gray-50 pb-3">
                <dt className="text-gray-500">Reference</dt>
                <dd className="font-medium text-gray-900">{booking.bookingReference ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Journey type</dt>
                <dd className="font-medium text-gray-900">{booking.journeyType}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title="Flight status timeline" subtitle="Newest updates first">
            <FlightTimeline events={events} />
          </Card>
        </div>
      </div>

      <Card title="Alert activity log" subtitle="Email and SMS delivery attempts">
        <NotificationLog notifications={notifications} />
      </Card>
    </div>
  );
}
