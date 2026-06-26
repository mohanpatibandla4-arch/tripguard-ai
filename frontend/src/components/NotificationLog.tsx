import { motion } from 'framer-motion';
import type { NotificationAttempt } from '../types';
import { formatDateTime } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface NotificationLogProps {
  notifications: NotificationAttempt[];
}

const channelIcon: Record<string, string> = {
  EMAIL: '📧',
  SMS: '💬',
};

export function NotificationLog({ notifications }: NotificationLogProps) {
  if (notifications.length === 0) {
    return (
      <p className="text-sm text-gray-500">No alerts sent for this booking yet.</p>
    );
  }

  return (
    <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
      {notifications.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-4 px-4 py-4 transition hover:bg-gray-50/80"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
            {channelIcon[item.channel] ?? '🔔'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{item.channel}</span>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 truncate text-sm text-gray-600">{item.message}</p>
            <p className="mt-1 text-xs text-gray-400">
              To {item.recipient} · {formatDateTime(item.attemptedAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
