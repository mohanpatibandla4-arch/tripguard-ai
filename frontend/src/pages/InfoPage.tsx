import { Link } from 'react-router-dom';

interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPage({ title, children }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/dashboard" className="text-sm font-medium text-eu-blue hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="section-title mt-4">{title}</h1>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600">{children}</div>
    </div>
  );
}

export function SupportPage() {
  return (
    <InfoPage title="Support">
      <p>
        TripGuard helps you track flights and stay ahead of delays. For help with your account,
        bookings, or notifications, email{' '}
        <a href="mailto:hello@tripguard.ai" className="text-eu-blue">
          hello@tripguard.ai
        </a>
        .
      </p>
      <p>
        Include your registered email and flight number so we can assist you faster.
      </p>
    </InfoPage>
  );
}

export function PrivacyPage() {
  return (
    <InfoPage title="Privacy">
      <p>
        We store your account details, bookings, and notification preferences to provide trip
        tracking and alerts. We do not sell your personal data.
      </p>
      <p>
        Contact details are used only for trip-related updates you opt into. You can update or
        remove your phone number at any time from the Alerts section.
      </p>
    </InfoPage>
  );
}

export function TermsPage() {
  return (
    <InfoPage title="Terms of service">
      <p>
        TripGuard provides flight status information and notification tools for travelers. Status
        data may come from third-party sources and should be verified with your airline before
        travel decisions.
      </p>
      <p>
        By using the service you agree to receive trip-related communications according to your
        notification preferences.
      </p>
    </InfoPage>
  );
}
