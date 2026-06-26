import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from '../components/AuthLayout';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber || undefined,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Registration failed.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking flights and get alerts when disruptions happen."
      footer={
        <p className="text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-gray-700">Full name</span>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input-field"
            placeholder="Jane Traveler"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-gray-700">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="you@example.com"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-gray-700">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="At least 8 characters"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-gray-700">Mobile number (SMS alerts)</span>
          <input
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="input-field"
            placeholder="+91 98765 43210"
          />
          <span className="text-xs text-gray-500">International format — you'll get text messages when flights change</span>
        </label>
        {error ? (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        ) : null}
        <AnimatedButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </AnimatedButton>
      </form>
    </AuthLayout>
  );
}
