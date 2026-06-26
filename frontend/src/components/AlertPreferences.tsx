import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getNotificationConfig, getNotifications, getProfile, updateProfile } from '../api/notifications';
import type { NotificationAttempt, NotificationConfig, UserResponse } from '../types';
import { getApiErrorMessage } from '../utils/apiError';
import { AnimatedButton } from './AnimatedButton';
import { Card } from './Card';
import { NotificationLog } from './NotificationLog';

function isValidPhone(value: string): boolean {
  const cleaned = value.trim().replace(/[\s()-]/g, '');
  return cleaned === '' || /^\+?\d{10,15}$/.test(cleaned);
}

export function AlertPreferences() {
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [notifications, setNotifications] = useState<NotificationAttempt[]>([]);
  const [phone, setPhone] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError('');
      const [profileResult, configResult, notifResult] = await Promise.allSettled([
        getProfile(),
        getNotificationConfig(),
        getNotifications(),
      ]);

      if (cancelled) {
        return;
      }

      if (profileResult.status === 'fulfilled') {
        const p = profileResult.value;
        setProfile(p);
        setPhone(p.phoneNumber ?? '');
        setEmailAlerts(p.emailAlertsEnabled ?? true);
        setSmsAlerts(p.smsAlertsEnabled ?? true);
      } else {
        setLoadError(getApiErrorMessage(profileResult.reason, 'Could not load your contact details.'));
      }

      if (configResult.status === 'fulfilled') {
        setConfig(configResult.value);
      }

      if (notifResult.status === 'fulfilled') {
        setNotifications(notifResult.value);
      }

      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const alertStatus = useMemo(() => {
    if (!profile) {
      return { label: 'Set up your contacts', tone: 'muted' as const };
    }
    const hasEmail = Boolean(profile.email);
    const hasPhone = Boolean(profile.phoneNumber?.trim());
    if (hasEmail && hasPhone && emailAlerts && smsAlerts) {
      return { label: 'Ready for trip updates', tone: 'ready' as const };
    }
    if (hasEmail && emailAlerts) {
      return { label: 'Email updates enabled', tone: 'ready' as const };
    }
    if (!hasPhone && smsAlerts) {
      return { label: 'Add a mobile number for SMS', tone: 'warn' as const };
    }
    return { label: 'Update your preferences below', tone: 'muted' as const };
  }, [profile, emailAlerts, smsAlerts]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (phone.trim() && !isValidPhone(phone)) {
      toast.error('Use international format, e.g. +91 9876543210');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        phoneNumber: phone.trim(),
        emailAlertsEnabled: emailAlerts,
        smsAlertsEnabled: smsAlerts,
      });
      setProfile(updated);
      setPhone(updated.phoneNumber ?? '');
      toast.success("You're all set. We'll use these details for trip updates.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not save your preferences.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="!p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">Trip notifications</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Choose how we reach you when a flight is delayed, cancelled, or changes gate.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                alertStatus.tone === 'ready'
                  ? 'bg-emerald-100 text-emerald-800'
                  : alertStatus.tone === 'warn'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {alertStatus.label}
            </span>
          </div>

          {loadError ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>
          ) : null}

          <form onSubmit={(e) => void handleSave(e)} className="mt-6 space-y-5">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-eu-blue focus:ring-eu-blue"
              />
              <span>
                <span className="font-semibold text-eu-navy">Email updates</span>
                <span className="mt-0.5 block text-ink-muted">
                  Sent to {profile?.email ?? 'your account email'}
                  {config && !config.emailProviderConfigured ? (
                    <span className="block text-xs text-amber-700">
                      Delivery provider not configured on server — preferences are saved for when it is.
                    </span>
                  ) : null}
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-eu-blue focus:ring-eu-blue"
              />
              <span className="flex-1">
                <span className="font-semibold text-eu-navy">SMS / text updates</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field mt-2"
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <span className="mt-1 block text-xs text-ink-muted">
                  International format with country code
                </span>
                {config && !config.smsProviderConfigured ? (
                  <span className="mt-1 block text-xs text-amber-700">
                    SMS delivery will begin once messaging is connected on the server.
                  </span>
                ) : null}
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm opacity-60">
              <input type="checkbox" disabled checked={false} className="mt-1 h-4 w-4 rounded" />
              <span>
                <span className="font-semibold text-eu-navy">WhatsApp updates</span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  WhatsApp delivery will be available once messaging is connected.
                </span>
              </span>
            </label>

            <AnimatedButton type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving…' : 'Save preferences'}
            </AnimatedButton>
          </form>
        </Card>
      </motion.div>

      <Card title="Recent alert activity" subtitle="Delivery attempts for your trips">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            No alerts yet. When a tracked flight changes, delivery attempts will appear here.
          </p>
        ) : (
          <NotificationLog notifications={notifications} />
        )}
      </Card>
    </div>
  );
}
