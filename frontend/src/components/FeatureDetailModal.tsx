import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export interface FeatureDetail {
  id: string;
  icon: string;
  title: string;
  summary: string;
  body: string;
  bullets: string[];
}

interface FeatureDetailModalProps {
  feature: FeatureDetail | null;
  onClose: () => void;
}

export function FeatureDetailModal({ feature, onClose }: FeatureDetailModalProps) {
  useEffect(() => {
    if (!feature) {
      return;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [feature, onClose]);

  return (
    <AnimatePresence>
      {feature ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feature-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-eu-navy/50 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            >
              Close
            </button>
            <span className="text-3xl" aria-hidden>
              {feature.icon}
            </span>
            <h3 id="feature-modal-title" className="mt-3 text-xl font-bold text-eu-navy">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{feature.summary}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-700">{feature.body}</p>
            <ul className="mt-4 space-y-2">
              {feature.bullets.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-eu-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1 flex-1 rounded-full bg-gradient-to-r from-eu-blue/30 to-eu-blue"
                  style={{ opacity: 0.4 + i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export const FEATURE_DETAILS: FeatureDetail[] = [
  {
    id: 'track',
    icon: '✈️',
    title: 'Track flights',
    summary: 'Live status and route progress in one place.',
    body: 'See live status, route progress, airport details, and schedule changes without jumping between airline apps.',
    bullets: [
      'Refresh status with one tap',
      'View delays, gates, and terminals',
      'Follow the full timeline from departure to arrival',
    ],
  },
  {
    id: 'alerts',
    icon: '🔔',
    title: 'Trip notifications',
    summary: 'Get updates before problems grow.',
    body: 'Get notified when your trip changes, using the contact channels you choose.',
    bullets: [
      'Email and SMS preferences you control',
      'Alerts when delays or cancellations are detected',
      'Honest delivery status in your alert history',
    ],
  },
  {
    id: 'timeline',
    icon: '📋',
    title: 'Event timeline',
    summary: 'A clear record of every change.',
    body: 'Review every status change and alert attempt for the trip — useful at the airport or when speaking with your airline.',
    bullets: [
      'Chronological status history',
      'Alert delivery log per trip',
      'Helpful when plans change mid-journey',
    ],
  },
];
