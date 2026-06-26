import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LinkButton } from './LinkButton';
import { Logo } from './Logo';
import { LogoutButton } from './Layout';

const navClass = (isActive: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-eu-blue/10 text-eu-blue'
      : 'text-ink-muted hover:bg-muted hover:text-eu-navy'
  }`;

const subNavClass = (isActive: boolean) =>
  `whitespace-nowrap border-b-2 pb-1.5 text-sm font-semibold transition ${
    isActive
      ? 'border-eu-yellow text-eu-blue'
      : 'border-transparent text-ink-muted hover:border-eu-blue/30 hover:text-eu-blue'
  }`;

function bookingsTab(location: ReturnType<typeof useLocation>): string | null {
  if (location.pathname !== '/bookings') {
    return null;
  }
  return new URLSearchParams(location.search).get('tab') ?? 'flights';
}

function isBookingsTab(location: ReturnType<typeof useLocation>, tab: string): boolean {
  return bookingsTab(location) === tab;
}

function isMyTripsActive(pathname: string): boolean {
  return pathname === '/bookings' || pathname.startsWith('/bookings/');
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const q = search.trim();
    const params = new URLSearchParams();
    params.set('tab', 'flights');
    if (q) {
      params.set('q', q);
    }
    navigate(`/bookings?${params.toString()}`);
  }

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="h-0.5 bg-gradient-to-r from-eu-blue via-eu-yellow to-eu-red" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/dashboard">
          <Logo size="md" />
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 justify-center px-4 md:flex">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-muted px-4 py-2.5 shadow-inner transition focus-within:border-eu-blue focus-within:ring-2 focus-within:ring-eu-blue/20">
            <span aria-hidden className="text-eu-blue">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flights, routes, alerts..."
              className="w-full bg-transparent text-sm text-eu-navy outline-none placeholder:text-ink-muted"
            />
          </div>
        </form>

        <nav className="flex flex-wrap items-center gap-1">
          <Link to="/dashboard" className={navClass(location.pathname === '/dashboard')}>
            Dashboard
          </Link>
          <Link
            to="/bookings?tab=flights"
            className={navClass(isMyTripsActive(location.pathname))}
          >
            My trips
          </Link>
          <LinkButton to="/bookings/new" variant="ai" size="sm">
            ✦ Add booking
          </LinkButton>
          <LogoutButton />
        </nav>
      </div>
      <div className="border-t border-border/60 bg-white/70">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-2.5 sm:px-6">
          <Link
            to="/bookings?tab=flights"
            className={subNavClass(isBookingsTab(location, 'flights'))}
          >
            Flights
          </Link>
          <Link
            to="/bookings?tab=tracking"
            className={subNavClass(isBookingsTab(location, 'tracking'))}
          >
            Status tracking
          </Link>
          <Link
            to="/bookings?tab=alerts"
            className={subNavClass(isBookingsTab(location, 'alerts'))}
          >
            Alerts
          </Link>
          <Link
            to="/bookings/new"
            className={subNavClass(location.pathname === '/bookings/new')}
          >
            Add trip
          </Link>
        </div>
      </div>
    </header>
  );
}
