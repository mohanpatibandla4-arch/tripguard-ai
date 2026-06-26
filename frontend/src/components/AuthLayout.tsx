import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FlightScene } from './FlightScene';
import { Logo } from './Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <FlightScene />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/login">
            <Logo variant="light" size="lg" />
          </Link>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-eu-yellow">
              Global travel assistant
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Guard every flight.</h1>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Track live status, get trip notifications, and stay ahead of delays — whether you are
              crossing a city or a continent.
            </p>
          </div>
          <p className="text-sm text-white/60">Your trips, guarded worldwide.</p>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center bg-muted px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-eu-navy">{title}</h2>
          <p className="mt-2 text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
