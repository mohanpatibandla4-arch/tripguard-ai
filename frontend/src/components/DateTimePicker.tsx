import { useMemo } from 'react';

interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (isoLocal: string) => void;
  min?: string;
}

function splitDateTime(isoLocal: string): { date: string; time: string } {
  if (!isoLocal || !isoLocal.includes('T')) {
    return { date: '', time: '12:00' };
  }
  const [date, time] = isoLocal.split('T');
  return { date, time: time?.slice(0, 5) ?? '12:00' };
}

function combineDateTime(date: string, time: string): string {
  if (!date) {
    return '';
  }
  return `${date}T${time || '12:00'}`;
}

export function DateTimePicker({ label, value, onChange, min }: DateTimePickerProps) {
  const { date, time } = useMemo(() => splitDateTime(value), [value]);
  const minDate = min ? splitDateTime(min).date : undefined;

  return (
    <div className="space-y-2 text-sm">
      <span className="font-semibold text-eu-navy">{label}</span>
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-white shadow-sm focus-within:border-eu-blue focus-within:ring-2 focus-within:ring-eu-blue/20">
          <div className="flex w-11 shrink-0 items-center justify-center border-r border-border bg-eu-blue/5 text-eu-blue">
            <CalendarIcon />
          </div>
          <input
            type="date"
            required
            value={date}
            min={minDate}
            onChange={(e) => onChange(combineDateTime(e.target.value, time))}
            className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-eu-navy outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <div className="flex w-[7.5rem] shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm focus-within:border-eu-red focus-within:ring-2 focus-within:ring-eu-red/20">
          <div className="flex w-10 shrink-0 items-center justify-center border-r border-border bg-eu-red/5 text-eu-red">
            <ClockIcon />
          </div>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => onChange(combineDateTime(date, e.target.value))}
            className="w-full border-0 bg-transparent px-2 py-3 text-sm text-eu-navy outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
