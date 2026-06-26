import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getBookings, trackFlightStatus } from '../api/bookings';
import { AlertPreferences } from '../components/AlertPreferences';
import { BookingCard } from '../components/BookingCard';
import { BookingFlowStepper } from '../components/BookingFlowStepper';
import { EmptyState } from '../components/EmptyState';
import { FlightTrackSearch } from '../components/FlightTrackSearch';
import { LinkButton } from '../components/LinkButton';
import { BookingCardSkeleton } from '../components/Skeleton';
import type { Booking } from '../types';
import { getApiErrorMessage } from '../utils/apiError';

type TripsTab = 'flights' | 'tracking' | 'alerts';

const TAB_COPY: Record<TripsTab, { title: string; subtitle: string }> = {
  flights: {
    title: 'My trips',
    subtitle: 'Browse your bookings or add a new flight to start tracking.',
  },
  tracking: {
    title: 'Status tracking',
    subtitle: 'Search by flight number or tap Track now on any trip for live updates.',
  },
  alerts: {
    title: 'Flight updates',
    subtitle: 'Manage how we reach you when schedules change, and review past alert activity.',
  },
};

function matchesTab(booking: Booking, tab: TripsTab): boolean {
  switch (tab) {
    case 'tracking':
      return booking.status === 'SCHEDULED' || booking.status === 'ACTIVE';
    case 'alerts':
      return booking.status === 'CANCELLED' || booking.status === 'ACTIVE';
    default:
      return true;
  }
}

export function BookingListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get('tab') as TripsTab) || 'flights';
  const activeTab: TripsTab =
    tab === 'tracking' || tab === 'alerts' ? tab : 'flights';
  const initialQuery = searchParams.get('q') ?? '';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(initialQuery);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const copy = TAB_COPY[activeTab];

  const loadBookings = useCallback(async () => {
    try {
      setBookings(await getBookings());
    } catch (err) {
      const message = getApiErrorMessage(err, 'We could not load your trips right now.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (!matchesTab(b, activeTab)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        b.flightNumber.toLowerCase().includes(q) ||
        b.departureAirport.toLowerCase().includes(q) ||
        b.arrivalAirport.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    });
  }, [bookings, query, activeTab]);

  function updateParams(updates: { q?: string; tab?: TripsTab }) {
    const next = new URLSearchParams(searchParams);
    if (updates.tab !== undefined) {
      next.set('tab', updates.tab);
    }
    if (updates.q !== undefined) {
      if (updates.q) {
        next.set('q', updates.q);
      } else {
        next.delete('q');
      }
    }
    setSearchParams(next);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    updateParams({ q: value.trim(), tab: activeTab });
  }

  async function handleQuickTrack(bookingId: string) {
    setTrackingId(bookingId);
    try {
      const event = await trackFlightStatus(bookingId);
      toast.success(`Status updated: ${event.status.replace(/_/g, ' ')}`);
      navigate(`/bookings/${bookingId}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not refresh flight status.'));
    } finally {
      setTrackingId(null);
    }
  }

  if (activeTab === 'alerts') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="section-title">{copy.title}</h1>
          <p className="mt-2 text-gray-500">{copy.subtitle}</p>
        </div>
        <AlertPreferences />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BookingFlowStepper />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{copy.title}</h1>
          <p className="mt-2 text-gray-500">{copy.subtitle}</p>
        </div>
        <LinkButton to="/bookings/new">+ Add booking</LinkButton>
      </div>

      {activeTab === 'tracking' ? (
        <FlightTrackSearch bookings={bookings} onTracked={() => void loadBookings()} />
      ) : null}

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <span className="text-gray-400" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by flight, route, or status..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        {query ? (
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="text-xs font-medium text-gray-500 hover:text-gray-800"
          >
            Clear
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        bookings.length === 0 ? (
          <EmptyState
            title="No trips yet"
            description="Add your first flight to start tracking status and receiving trip updates."
            actionLabel="Add booking"
            actionTo="/bookings/new"
          />
        ) : query ? (
          <EmptyState
            title="No matches"
            description="Try a different search term or clear the filter."
            actionLabel="Clear search"
            onAction={() => handleSearchChange('')}
          />
        ) : activeTab === 'tracking' ? (
          <EmptyState
            title="No trips to track"
            description="Add a scheduled flight, then refresh status from here or the trip detail page."
            actionLabel="Add booking"
            actionTo="/bookings/new"
          />
        ) : (
          <EmptyState
            title="No trips found"
            description="Try another tab or add a new booking."
            actionLabel="Add booking"
            actionTo="/bookings/new"
          />
        )
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              index={index}
              showQuickTrack={activeTab === 'tracking'}
              tracking={trackingId === booking.id}
              onQuickTrack={(bookingId) => void handleQuickTrack(bookingId)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
