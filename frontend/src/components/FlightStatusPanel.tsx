import type { Booking, FlightStatusEvent } from '../types';
import { formatDateTime, formatTime } from '../utils/format';
import { LiveFlightTracker } from './AnimatedFlightMark';

interface FlightStatusPanelProps {
  booking: Booking;
  event: FlightStatusEvent | null;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'LANDED':
      return 'Arrived';
    case 'DEPARTED':
      return 'In flight';
    case 'DELAYED':
      return 'Delayed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'ON_TIME':
      return 'On time';
    default:
      return status.replace(/_/g, ' ');
  }
}

function progressPercent(status: string): number {
  switch (status) {
    case 'LANDED':
      return 100;
    case 'DEPARTED':
      return 55;
    case 'DELAYED':
    case 'ON_TIME':
      return 12;
    default:
      return 0;
  }
}

function durationMinutes(dep: string, arr: string): string {
  const ms = new Date(arr).getTime() - new Date(dep).getTime();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.round((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function FlightStatusPanel({ booking, event }: FlightStatusPanelProps) {
  const status = event?.status ?? 'ON_TIME';
  const delay = event?.delayMinutes ?? 0;
  const progress = progressPercent(status);
  const depActual = event?.estimatedDeparture ?? booking.scheduledDeparture;
  const arrActual = event?.estimatedArrival ?? booking.scheduledArrival;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-slate-50 to-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-gray-900">
          {booking.flightNumber} flight status
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {booking.departureAirport} → {booking.arrivalAirport}
          {event ? ` · Updated ${formatDateTime(event.fetchedAt)}` : ''}
        </p>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="flex items-start justify-between gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-900">{booking.departureAirport}</p>
            {event?.terminal ? (
              <p className="text-gray-500">Terminal {event.terminal}</p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">{booking.arrivalAirport}</p>
            {event?.gate ? <p className="text-gray-500">Gate {event.gate}</p> : null}
          </div>
        </div>

        <div className="relative my-6">
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <LiveFlightTracker
            progress={progress}
            inFlight={status === 'DEPARTED' || status === 'LANDED'}
          />
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <span
              className={`inline-flex flex-col items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                status === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800'
                  : status === 'LANDED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'DELAYED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
              }`}
            >
              {statusLabel(status)}
              <span className="mt-0.5 text-[10px] font-medium normal-case text-gray-600">
                {durationMinutes(booking.scheduledDeparture, booking.scheduledArrival)}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Departure</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatTime(depActual)}</p>
            {delay > 0 ? (
              <p className="mt-1 text-sm font-medium text-rose-600">{delay}m delay</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Scheduled {formatTime(booking.scheduledDeparture)}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Arrival</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatTime(arrActual)}</p>
            <p className="mt-1 text-sm text-gray-500">
              Scheduled {formatTime(booking.scheduledArrival)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
