import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('TripGuard UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h2 className="text-lg font-bold text-rose-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-rose-800">
            We could not load this screen. Try refreshing, or return to your dashboard.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-xl bg-eu-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Back to dashboard
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
