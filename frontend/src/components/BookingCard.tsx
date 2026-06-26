import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Booking } from '../types';
import { formatDateTime } from '../utils/format';
import { routeEmoji, routeGradient } from '../utils/routeVisual';
import { AnimatedButton } from './AnimatedButton';
import { StatusBadge } from './StatusBadge';

interface BookingCardProps {
  booking: Booking;
  index?: number;
  showQuickTrack?: boolean;
  tracking?: boolean;
  onQuickTrack?: (bookingId: string) => void;
}

export function BookingCard({
  booking,
  index = 0,
  showQuickTrack = false,
  tracking = false,
  onQuickTrack,
}: BookingCardProps) {
  const gradient = routeGradient(booking.departureAirport, booking.arrivalAirport);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <Link
        to={`/bookings/${booking.id}`}
        className="group card-hover block"
      >
        <div className={`relative h-36 bg-gradient-to-br ${gradient} p-5`}>
          <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/5" />
          <div className="relative flex items-start justify-between">
            <span className="text-2xl">{routeEmoji(booking.departureAirport, booking.arrivalAirport)}</span>
            <StatusBadge status={booking.status} />
          </div>
          <div className="relative mt-8">
            <p className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {booking.flightNumber}
            </p>
            <p className="mt-1 text-sm font-medium text-white/90">
              {booking.departureAirport} → {booking.arrivalAirport}
            </p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">Scheduled departure</p>
          <p className="mt-0.5 font-medium text-gray-900">
            {formatDateTime(booking.scheduledDeparture)}
          </p>
          {!showQuickTrack ? (
            <p className="mt-3 text-xs font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
              View flight timeline →
            </p>
          ) : null}
        </div>
      </Link>
      {showQuickTrack && onQuickTrack ? (
        <div className="border-t border-gray-100 px-4 pb-4">
          <AnimatedButton
            variant="primary"
            size="sm"
            className="mt-3 w-full"
            disabled={tracking}
            onClick={(e) => {
              e.preventDefault();
              onQuickTrack(booking.id);
            }}
          >
            {tracking ? 'Tracking…' : '⟳ Track now'}
          </AnimatedButton>
        </div>
      ) : null}
    </motion.div>
  );
}
