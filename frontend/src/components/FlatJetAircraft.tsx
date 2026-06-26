import { motion, useReducedMotion } from 'framer-motion';

const OUTLINE = '#64748b';
const NAVY = '#0a1628';
const YELLOW = '#FFCC00';

interface FlatJetAircraftProps {
  size?: number;
  className?: string;
  showSpeedLines?: boolean;
  animated?: boolean;
}

/**
 * Flat 2D side-view jet — EU yellow / navy (Pinterest-style airplane animation).
 */
export function FlatJetAircraft({
  size = 100,
  className = '',
  showSpeedLines = true,
  animated = false,
}: FlatJetAircraftProps) {
  const height = size * 0.36;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 100 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {showSpeedLines ? (
        <g className={animated ? 'flight-speed-lines' : undefined} opacity="0.55">
          <line x1="3" y1="14" x2="13" y2="14" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="1" y1="18" x2="11" y2="18" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="5" y1="22" x2="15" y2="22" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      ) : null}

      {/* Wing */}
      <path
        d="M28 21.5H58L54.5 25H26.5L28 21.5Z"
        fill="#cbd5e1"
        stroke={OUTLINE}
        strokeWidth="0.55"
        strokeLinejoin="round"
      />

      {/* Tail fin */}
      <path
        d="M11 22.5V9.5L21 22.5H11Z"
        fill={NAVY}
        stroke={OUTLINE}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path d="M12.2 12.5L16.8 19.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12.2 14.8L16.8 21.2" stroke={YELLOW} strokeWidth="1.3" strokeLinecap="round" />

      {/* Fuselage lower */}
      <path
        d="M18 20H24.5L29 27H69.5L86.5 23.5C89.5 22.5 90.5 21 90 20H18Z"
        fill={NAVY}
        stroke={OUTLINE}
        strokeWidth="0.65"
        strokeLinejoin="round"
      />

      {/* Fuselage upper */}
      <path
        d="M18 20H24.5L29 13H69.5L86.5 16.5C89.5 17.5 90.5 19 90 20H18Z"
        fill={YELLOW}
        stroke={OUTLINE}
        strokeWidth="0.65"
        strokeLinejoin="round"
      />

      {/* Nose */}
      <path
        d="M84 16.2C90.5 18.2 90.5 21.8 84 23.8V16.2Z"
        fill="#e8eef8"
        stroke={OUTLINE}
        strokeWidth="0.5"
      />

      {/* Engines */}
      <ellipse cx="39.5" cy="26.8" rx="4" ry="3.4" fill={NAVY} stroke={OUTLINE} strokeWidth="0.5" />
      <ellipse cx="39.5" cy="26" rx="2.4" ry="2.1" fill={YELLOW} />
      <ellipse cx="52.5" cy="26.8" rx="4" ry="3.4" fill={NAVY} stroke={OUTLINE} strokeWidth="0.5" />
      <ellipse cx="52.5" cy="26" rx="2.4" ry="2.1" fill={YELLOW} />

      {/* Cabin windows */}
      <rect x="43.5" y="15.2" width="3.6" height="2.3" rx="0.55" fill="white" stroke={OUTLINE} strokeWidth="0.25" />
      <rect x="48.8" y="15.2" width="3.6" height="2.3" rx="0.55" fill="white" stroke={OUTLINE} strokeWidth="0.25" />
      <rect x="54.1" y="15.2" width="3.6" height="2.3" rx="0.55" fill="white" stroke={OUTLINE} strokeWidth="0.25" />
      <rect x="59.4" y="15.2" width="3.6" height="2.3" rx="0.55" fill="white" stroke={OUTLINE} strokeWidth="0.25" />

      {/* Cockpit */}
      <path
        d="M71.5 15L78.5 16.8V19.2L71.5 19.2V15Z"
        fill="white"
        stroke={OUTLINE}
        strokeWidth="0.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloudShape({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden>
      <path
        d="M12 24C5.5 24 2 19.5 5 15.5C6.5 10 12 8 17 10C19 5 26 4 31 8C38 6 45 10 44 16C49 17 52 22 48 25C44 28 38 27 35 24H12Z"
        fill="white"
        fillOpacity="0.92"
        stroke="#94a3b8"
        strokeWidth="1"
      />
    </svg>
  );
}

export function DriftingClouds({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="absolute left-[8%] top-[18%] w-24 opacity-70"
        animate={reducedMotion ? undefined : { x: [0, 28, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CloudShape />
      </motion.div>
      <motion.div
        className="absolute right-[12%] top-[28%] w-20 opacity-50"
        animate={reducedMotion ? undefined : { x: [0, -22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <CloudShape />
      </motion.div>
      <motion.div
        className="absolute left-[35%] bottom-[22%] w-16 opacity-40"
        animate={reducedMotion ? undefined : { x: [0, 18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      >
        <CloudShape />
      </motion.div>
      <motion.div
        className="absolute right-[30%] top-[12%] w-14 opacity-35"
        animate={reducedMotion ? undefined : { x: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <CloudShape />
      </motion.div>
    </div>
  );
}

interface FlyingJetHeroProps {
  size?: number;
  className?: string;
}

/** Hero jet with bobbing flight + clouds (login / add-booking backgrounds) */
export function FlyingJetHero({ size = 240, className = '' }: FlyingJetHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <DriftingClouds />
      <div className="absolute inset-0 flex items-center justify-center pt-4">
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  y: [0, -12, 5, -8, 0],
                  rotate: [0, 0.8, -0.5, 0.4, 0],
                }
          }
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FlatJetAircraft size={size} showSpeedLines animated />
        </motion.div>
      </div>
    </div>
  );
}
