import { motion } from 'framer-motion';
import type { FlightStatusEvent } from '../types';
import { formatDateTime } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface FlightTimelineProps {
  events: FlightStatusEvent[];
}

export function FlightTimeline({ events }: FlightTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        No status events yet. Track this flight to see live updates.
      </p>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime(),
  );

  return (
    <ol className="relative space-y-0">
      {sorted.map((event, index) => {
        const isLatest = index === 0;
        const isLast = index === sorted.length - 1;

        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative flex gap-4 pb-8"
          >
            {!isLast ? (
              <span
                className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-0.5 bg-gradient-to-b from-emerald-400 to-gray-200"
                aria-hidden
              />
            ) : null}
            <span
              className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                isLatest ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-gray-300'
              }`}
            >
              {isLatest ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>
            <div
              className={`flex-1 rounded-xl border p-4 transition ${
                isLatest
                  ? 'border-emerald-200 bg-emerald-50/50 shadow-sm'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={event.status} size="md" />
                {isLatest ? (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Latest
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-gray-600">{formatDateTime(event.fetchedAt)}</p>
              {event.delayMinutes > 0 ? (
                <p className="mt-1 text-sm font-medium text-amber-700">
                  Delay: {event.delayMinutes} minutes
                </p>
              ) : null}
              {(event.gate || event.terminal) ? (
                <p className="mt-2 text-sm text-gray-700">
                  {event.gate ? `Gate ${event.gate}` : ''}
                  {event.gate && event.terminal ? ' · ' : ''}
                  {event.terminal ? `Terminal ${event.terminal}` : ''}
                </p>
              ) : null}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
