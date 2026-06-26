import { statusBadgeClass, statusLabel } from '../utils/format';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ring-1 ${sizeClass} ${statusBadgeClass(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}
