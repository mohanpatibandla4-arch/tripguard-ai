import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAirports } from '../api/discover';
import type { Airport } from '../types';

interface AirportSelectProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  excludeCode?: string;
}

export function AirportSelect({
  label,
  value,
  onChange,
  excludeCode,
}: AirportSelectProps) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<Airport[]>([]);
  const [selected, setSelected] = useState<Airport | undefined>();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    async function loadSelected() {
      if (!value) {
        setSelected(undefined);
        return;
      }
      const matches = await searchAirports(value);
      setSelected(matches.find((a) => a.code === value) ?? { code: value, city: value, country: '', region: '' });
    }
    loadSelected();
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const results = await searchAirports(query || value);
      setOptions(results.filter((a) => a.code !== excludeCode));
    }, 150);
    return () => window.clearTimeout(timer);
  }, [query, value, excludeCode, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    updatePosition();
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) {
        return;
      }
      const panel = document.getElementById(`airport-panel-${id}`);
      if (panel?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    function handleScroll() {
      updatePosition();
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, id, updatePosition]);

  function pick(airport: Airport) {
    onChange(airport.code);
    setSelected(airport);
    setQuery('');
    setOpen(false);
  }

  const dropdown = (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={`airport-panel-${id}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}
          className="overflow-hidden rounded-2xl border border-eu-blue/20 bg-white shadow-2xl shadow-eu-navy/20"
        >
          <div className="border-b border-border p-3">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, country, or code..."
              className="w-full rounded-xl border border-border bg-muted px-3 py-2.5 text-sm outline-none focus:border-eu-blue focus:ring-2 focus:ring-eu-blue/20"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink-muted">No airports found</li>
            ) : (
              options.map((airport) => (
                <li key={airport.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === airport.code}
                    onClick={() => pick(airport)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-eu-blue/5 ${
                      value === airport.code ? 'bg-eu-yellow/25' : ''
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-eu-red/10 text-xs font-bold text-eu-red">
                      {airport.code}
                    </span>
                    <span>
                      <span className="block font-semibold text-eu-navy">{airport.city}</span>
                      <span className="text-xs text-ink-muted">
                        {airport.country}
                        {airport.region ? ` · ${airport.region}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className="relative space-y-2 text-sm">
      <label htmlFor={id} className="font-semibold text-eu-navy">
        {label}
      </label>
      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={() => {
          updatePosition();
          setOpen((v) => !v);
        }}
        className={`input-field flex w-full items-center justify-between gap-2 text-left ${
          open ? 'border-eu-blue ring-2 ring-eu-blue/25' : ''
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-eu-blue/10 text-xs font-bold text-eu-blue">
            {selected?.code ?? '—'}
          </span>
          <span className="truncate text-left">
            {selected?.city
              ? `${selected.city}${selected.country ? `, ${selected.country}` : ''}`
              : 'Select airport'}
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-eu-blue">
          ▾
        </motion.span>
      </button>
      {typeof document !== 'undefined' ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
