import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Booking } from '../types';
import { formatDateTime, formatTime } from '../utils/format';
import { routeGradient } from '../utils/routeVisual';
import { StatusBadge } from './StatusBadge';

interface TripCardProps {
  booking: Booking;
  index?: number;
}

function airlineFromFlight(flightNumber: string): string {
  const match = flightNumber.match(/^([A-Z]{2})/i);
  return match ? match[1].toUpperCase() : '—';
}

function progressForStatus(status: Booking['status']): number {
  switch (status) {
    case 'ACTIVE':
      return 65;
    case 'COMPLETED':
      return 100;
    case 'CANCELLED':
      return 0;
    default:
      return 25;
  }
}

export function TripCard({ booking, index = 0 }: TripCardProps) {
  const gradient = routeGradient(booking.departureAirport, booking.arrivalAirport);
  const progress = progressForStatus(booking.status);
  const pulse = booking.status === 'ACTIVE' || booking.status === 'SCHEDULED';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-eu-blue/10"
    >
      <div className={`relative bg-gradient-to-br ${gradient} px-5 pb-5 pt-4 text-white`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
              {airlineFromFlight(booking.flightNumber)}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{booking.flightNumber}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm font-medium">
          <div>
            <p className="text-2xl font-bold">{booking.departureAirport}</p>
            <p className="text-white/80">{formatTime(booking.scheduledDeparture)}</p>
          </div>
          <div className="flex flex-1 flex-col items-center px-3">
            <div className="h-0.5 w-full rounded-full bg-white/30">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
            <span className="mt-1 text-[10px] uppercase tracking-wide text-white/70">Route</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{booking.arrivalAirport}</p>
            <p className="text-white/80">{formatTime(booking.scheduledArrival)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-sm text-gray-500">
          Departs {formatDateTime(booking.scheduledDeparture)}
        </p>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/bookings/${booking.id}`}
            className="rounded-lg bg-eu-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-eu-blue-light"
          >
            View details
          </Link>
          <Link
            to={`/bookings/${booking.id}`}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-eu-navy transition hover:bg-muted"
          >
            Track status
          </Link>
          <Link
            to="/bookings?tab=alerts"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-eu-navy transition hover:bg-muted"
          >
            Manage alerts
          </Link>
        </div>

        {pulse ? (
          <p className="text-xs font-medium text-emerald-700">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Monitoring for schedule changes
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
