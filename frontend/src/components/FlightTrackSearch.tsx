import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackFlightStatus } from '../api/bookings';
import type { Booking } from '../types';
import { getApiErrorMessage } from '../utils/apiError';
import { AnimatedButton } from './AnimatedButton';

const DEMO_FLIGHTS = [
  { flight: 'AI1802', from: 'VTZ', to: 'DEL', label: 'AI 1802 · VTZ→DEL (ixigo demo)' },
  { flight: 'BA100', from: 'LHR', to: 'JFK', label: 'BA 100 · LHR→JFK' },
];

interface FlightTrackSearchProps {
  bookings: Booking[];
  onTracked?: () => void;
}

export function FlightTrackSearch({ bookings, onTracked }: FlightTrackSearchProps) {
  const navigate = useNavigate();
  const [flightQuery, setFlightQuery] = useState('');
  const [tracking, setTracking] = useState(false);

  async function handleTrackNow() {
    const q = flightQuery.trim().toUpperCase().replace(/\s+/g, '');
    if (!q) {
      toast.error('Enter a flight number (e.g. AI1802)');
      return;
    }

    const match = bookings.find((b) =>
      b.flightNumber.toUpperCase().replace(/\s+/g, '').includes(q),
    );

    if (!match) {
      toast.error('No booking found for that flight. Add it first or use a demo chip below.');
      return;
    }

    setTracking(true);
    try {
      const event = await trackFlightStatus(match.id);
      toast.success(`Tracked ${match.flightNumber}: ${event.status.replace(/_/g, ' ')}`);
      onTracked?.();
      navigate(`/bookings/${match.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to track flight.'));
    } finally {
      setTracking(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-gray-900">
        Track a flight
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter your flight number and tap Track — like ixigo flight status search.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={flightQuery}
          onChange={(e) => setFlightQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void handleTrackNow();
            }
          }}
          placeholder="e.g. AI1802"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-eu-blue focus:ring-2 focus:ring-eu-blue/20"
        />
        <AnimatedButton
          size="lg"
          onClick={() => void handleTrackNow()}
          disabled={tracking}
          className="shrink-0"
        >
          {tracking ? 'Tracking…' : 'Track flight →'}
        </AnimatedButton>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs font-medium text-gray-500">Try demo:</span>
        {DEMO_FLIGHTS.map((demo) => (
          <Link
            key={demo.flight}
            to={`/bookings/new?from=${demo.from}&to=${demo.to}&flight=${demo.flight}`}
            className="rounded-full border border-eu-blue/30 bg-eu-blue/5 px-3 py-1 text-xs font-semibold text-eu-navy hover:bg-eu-blue/10"
          >
            {demo.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
