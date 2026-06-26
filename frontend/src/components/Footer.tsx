import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-eu-navy text-white">
      <div className="h-1 bg-gradient-to-r from-eu-blue via-eu-yellow to-eu-red" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Built for travelers worldwide. Track every trip from one dashboard — delays, gate
              changes, and cancellations included.
            </p>
          </div>

          <div>
            <p className="font-semibold text-eu-yellow">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <Link to="/dashboard" className="transition hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bookings?tab=tracking" className="transition hover:text-white">
                  Flight tracking
                </Link>
              </li>
              <li>
                <Link to="/bookings?tab=alerts" className="transition hover:text-white">
                  Alerts
                </Link>
              </li>
              <li>
                <Link to="/bookings?tab=flights" className="transition hover:text-white">
                  Trips
                </Link>
              </li>
              <li>
                <Link to="/bookings/new" className="transition hover:text-white">
                  Add booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-eu-yellow">Support</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <Link to="/support" className="transition hover:text-white">
                  Help & contact
                </Link>
              </li>
              <li>
                <a href="mailto:hello@tripguard.ai" className="transition hover:text-white">
                  hello@tripguard.ai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-eu-yellow">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <Link to="/privacy" className="transition hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-white">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} TripGuard AI. Guard every flight.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-eu-blue" />
            <span className="h-2 w-2 rounded-full bg-eu-yellow" />
            <span className="h-2 w-2 rounded-full bg-eu-red" />
            <span className="ml-1">Built for travelers worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
