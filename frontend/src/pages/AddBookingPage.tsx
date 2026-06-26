import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createBooking } from '../api/bookings';
import { AirportSelect } from '../components/AirportSelect';
import { AnimatedButton } from '../components/AnimatedButton';
import { BookingFlowStepper } from '../components/BookingFlowStepper';
import { DateTimePicker } from '../components/DateTimePicker';
import { FlightScene } from '../components/FlightScene';
import { LinkButton } from '../components/LinkButton';
import { getApiErrorMessage } from '../utils/apiError';
import { toIsoDateTimeLocal } from '../utils/format';

export function AddBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDeparture = toIsoDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const defaultArrival = toIsoDateTimeLocal(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
  );

  const [form, setForm] = useState({
    airlineCode: 'AY',
    flightNumber: '',
    departureAirport: searchParams.get('from') ?? 'HEL',
    arrivalAirport: searchParams.get('to') ?? '',
    scheduledDeparture: defaultDeparture,
    scheduledArrival: defaultArrival,
    bookingReference: '',
    journeyType: 'FLIGHT' as const,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const flight = searchParams.get('flight');
    if (from || to || flight) {
      setForm((prev) => {
        const next = {
          ...prev,
          departureAirport: from ?? prev.departureAirport,
          arrivalAirport: to ?? prev.arrivalAirport,
        };
        if (flight) {
          const normalized = flight.toUpperCase().replace(/\s/g, '');
          const match = normalized.match(/^([A-Z]{2})(\d+)$/);
          if (match) {
            next.airlineCode = match[1];
            next.flightNumber = match[2];
          } else {
            next.flightNumber = normalized;
          }
        }
        return next;
      });
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.departureAirport || !form.arrivalAirport) {
      toast.error('Please select origin and destination airports.');
      return;
    }
    if (form.departureAirport === form.arrivalAirport) {
      toast.error('Origin and destination must be different.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const booking = await createBooking({
        flightNumber: `${form.airlineCode}${form.flightNumber}`.toUpperCase(),
        departureAirport: form.departureAirport,
        arrivalAirport: form.arrivalAirport,
        scheduledDeparture: new Date(form.scheduledDeparture).toISOString(),
        scheduledArrival: new Date(form.scheduledArrival).toISOString(),
        bookingReference: form.bookingReference || undefined,
        journeyType: form.journeyType,
      });
      toast.success('Booking created — tracking ready!');
      navigate(`/bookings/${booking.id}`);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to create booking.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative -mx-4 -mt-8 min-h-[calc(100vh-4rem)] sm:-mx-6">
      <FlightScene />

      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur">
          <BookingFlowStepper />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <LinkButton
            to="/bookings?tab=flights"
            variant="ghost"
            size="sm"
            className="!text-white/90 hover:!bg-white/10"
          >
            ← Back to trips
          </LinkButton>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Add your next trip
          </h1>
          <p className="mt-2 max-w-lg text-white/80">
            Register a flight and TripGuard will track status changes and send updates to your
            chosen contact channels.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="overflow-visible rounded-3xl border border-white/20 bg-white/95 shadow-2xl shadow-eu-navy/20 backdrop-blur-xl"
        >
          <div className="h-1.5 bg-gradient-to-r from-eu-blue via-eu-yellow to-eu-red" />

          <form className="grid gap-6 p-6 sm:p-8 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-eu-navy">Flight details</h2>
              <p className="text-sm text-ink-muted">Enter your airline, route, and schedule</p>
            </div>

            <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span className="font-semibold text-eu-navy">Airline code</span>
                <input
                  required
                  maxLength={3}
                  value={form.airlineCode}
                  onChange={(e) => setForm({ ...form, airlineCode: e.target.value.toUpperCase() })}
                  placeholder="AY"
                  className="input-field uppercase"
                />
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold text-eu-navy">Flight number</span>
                <input
                  required
                  value={form.flightNumber}
                  onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
                  placeholder="1331"
                  className="input-field"
                />
              </label>
            </div>

            <AirportSelect
              label="Origin"
              value={form.departureAirport}
              onChange={(code) => setForm({ ...form, departureAirport: code })}
              excludeCode={form.arrivalAirport}
            />
            <AirportSelect
              label="Destination"
              value={form.arrivalAirport}
              onChange={(code) => setForm({ ...form, arrivalAirport: code })}
              excludeCode={form.departureAirport}
            />

            <DateTimePicker
              label="Departure"
              value={form.scheduledDeparture}
              onChange={(v) => setForm({ ...form, scheduledDeparture: v })}
            />
            <DateTimePicker
              label="Arrival"
              value={form.scheduledArrival}
              onChange={(v) => setForm({ ...form, scheduledArrival: v })}
              min={form.scheduledDeparture}
            />

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-semibold text-eu-navy">Booking reference (optional)</span>
              <input
                value={form.bookingReference}
                onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                placeholder="ABC123"
                className="input-field"
              />
            </label>

            {error ? (
              <p className="rounded-xl bg-eu-red-soft px-4 py-3 text-sm text-eu-red md:col-span-2">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <AnimatedButton type="submit" size="lg" disabled={loading}>
                {loading ? 'Creating...' : '✈ Create booking'}
              </AnimatedButton>
              <LinkButton to="/bookings?tab=flights" variant="secondary" size="lg">
                Cancel
              </LinkButton>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
