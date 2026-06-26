import { Link, useLocation, useSearchParams } from 'react-router-dom';

const STEPS = [
  { id: 'search', label: 'Search flights', to: '/bookings?tab=flights' },
  { id: 'book', label: 'Add booking', to: '/bookings/new' },
  { id: 'track', label: 'Track status', to: '/bookings?tab=tracking' },
  { id: 'alerts', label: 'Alerts', to: '/bookings?tab=alerts' },
] as const;

function activeStepIndex(pathname: string, tab: string | null): number {
  if (pathname.startsWith('/bookings/new')) {
    return 1;
  }
  if (pathname.match(/^\/bookings\/[^/]+$/)) {
    return 2;
  }
  if (tab === 'alerts') {
    return 3;
  }
  if (tab === 'tracking') {
    return 2;
  }
  return 0;
}

export function BookingFlowStepper() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const active = activeStepIndex(pathname, tab);

  return (
    <nav aria-label="Booking process" className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:gap-2">
        {STEPS.map((step, index) => {
          const isActive = index === active;
          const isComplete = index < active;

          return (
            <li key={step.id} className="flex items-center">
              {index > 0 ? (
                <span
                  className={`mx-1 hidden h-px w-6 sm:block ${isComplete ? 'bg-emerald-400' : 'bg-gray-200'}`}
                  aria-hidden
                />
              ) : null}
              <Link
                to={step.to}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  isActive
                    ? 'bg-eu-blue text-white shadow-md'
                    : isComplete
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
