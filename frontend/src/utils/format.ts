export function formatDateTime(value?: string): string {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value?: string): string {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(value?: string): string {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toIsoDateTimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case 'ON_TIME':
    case 'SCHEDULED':
    case 'SENT':
      return 'bg-eu-blue/10 text-eu-blue ring-eu-blue/25';
    case 'DELAYED':
    case 'ACTIVE':
    case 'PENDING':
      return 'bg-eu-yellow-soft text-eu-navy ring-eu-yellow/50';
    case 'CANCELLED':
    case 'FAILED':
      return 'bg-eu-red-soft text-eu-red ring-eu-red/30';
    default:
      return 'bg-muted text-ink-muted ring-border';
  }
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}
