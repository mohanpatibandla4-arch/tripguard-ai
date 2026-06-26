import { useId } from 'react';
import { AircraftAlongPath, SHIELD_FLIGHT_PATH } from './AnimatedFlightMark';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'text-base', gap: 'gap-2' },
  md: { icon: 40, text: 'text-lg', gap: 'gap-2.5' },
  lg: { icon: 48, text: 'text-xl', gap: 'gap-3' },
};

function ShieldMark({ size, variant }: { size: number; variant: 'light' | 'dark' }) {
  const rawId = useId().replace(/:/g, '');
  const shieldGrad = `tg-shield-grad-${rawId}`;
  const innerGrad = `tg-shield-inner-${rawId}`;
  const glowFilter = `tg-shield-glow-${rawId}`;
  const pathGrad = `tg-path-grad-${rawId}`;
  const motionPathId = `tg-motion-path-${rawId}`;

  const rimStroke = variant === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id={shieldGrad} x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e4fd6" />
          <stop offset="45%" stopColor="#003399" />
          <stop offset="100%" stopColor="#0a1628" />
        </linearGradient>
        <linearGradient id={innerGrad} x1="14" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={pathGrad} x1="12" y1="26" x2="36" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCC00" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <filter id={glowFilter} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#003399" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1e4fd6" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#${glowFilter})`}>
        <path
          d="M24 2.5L41.5 10.2V22.2C41.5 32.4 34.2 41.2 24 45.5C13.8 41.2 6.5 32.2 6.5 22.2V10.2L24 2.5Z"
          fill={`url(#${shieldGrad})`}
          stroke={rimStroke}
          strokeWidth="0.75"
        />
        <path
          d="M24 7.5L37 13.5V22C37 28.8 31.4 35 24 37.5C16.6 35 11 28.8 11 22V13.5L24 7.5Z"
          fill={`url(#${innerGrad})`}
        />
      </g>

      {/* Curved flight trajectory */}
      <path
        d={SHIELD_FLIGHT_PATH}
        stroke={`url(#${pathGrad})`}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      <path
        d={SHIELD_FLIGHT_PATH}
        className="flight-path-base"
        stroke="#FFCC00"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      <AircraftAlongPath pathId={motionPathId} pathD={SHIELD_FLIGHT_PATH} durationSec={4.2} jetSize={28} />

      {/* Destination pin */}
      <g transform="translate(24, 33)">
        <path
          d="M0 -5.5C2.8 -5.5 5 -3.3 5 -0.5C5 2.5 0 7.5 0 7.5C0 7.5 -5 2.5 -5 -0.5C-5 -3.3 -2.8 -5.5 0 -5.5Z"
          fill="#DA291C"
          stroke="#ffffff"
          strokeWidth="0.85"
        />
        <circle cx="0" cy="-0.5" r="1.6" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = '',
}: LogoProps) {
  const s = sizes[size];
  const textClass = variant === 'light' ? 'text-white' : 'text-eu-navy';
  const aiClass = variant === 'light' ? 'text-eu-yellow' : 'text-eu-blue';

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <ShieldMark size={s.icon} variant={variant} />
      {showText ? (
        <span className={`font-bold tracking-tight ${s.text} ${textClass}`}>
          TripGuard{' '}
          <span className={`${aiClass} font-extrabold`}>AI</span>
        </span>
      ) : null}
    </div>
  );
}

export function LogoIcon({
  size = 40,
  variant = 'dark',
  className = '',
}: {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <span className={className}>
      <ShieldMark size={size} variant={variant} />
    </span>
  );
}
