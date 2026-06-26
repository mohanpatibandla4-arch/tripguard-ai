import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChatBot } from './ChatBot';
import { ErrorBoundary } from './ErrorBoundary';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </motion.main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export function ProtectedRoute() {
  const { authenticated } = useAuth();
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

export function PublicOnlyRoute() {
  const { authenticated } = useAuth();
  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition hover:bg-muted hover:text-eu-navy"
    >
      Logout
    </button>
  );
}
