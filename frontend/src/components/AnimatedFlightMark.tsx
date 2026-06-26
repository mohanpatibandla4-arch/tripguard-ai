import { motion, useReducedMotion } from 'framer-motion';
import { FlatJetAircraft } from './FlatJetAircraft';

/** Curved trajectory inside the TripGuard shield logo */
export const SHIELD_FLIGHT_PATH =
  'M11.5 27.5C16 19.5 20.5 17 24 18.5C27.5 20 31.5 19 35.5 15.5';

interface AircraftAlongPathProps {
  pathId: string;
  pathD: string;
  durationSec?: number;
  jetSize?: number;
}

/** SVG animateMotion — flat jet travels the shield route */
export function AircraftAlongPath({
  pathId,
  pathD,
  durationSec = 3.8,
  jetSize = 26,
}: AircraftAlongPathProps) {
  const reducedMotion = useReducedMotion();
  const offsetY = jetSize * 0.18;

  return (
    <>
      <path id={pathId} d={pathD} fill="none" stroke="none" />
      <path
        d={pathD}
        className={reducedMotion ? undefined : 'flight-path-trail'}
        stroke="#FFCC00"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {reducedMotion ? (
        <g transform={`translate(8, ${22 - offsetY})`}>
          <FlatJetAircraft size={jetSize} showSpeedLines />
        </g>
      ) : (
        <g className="flight-motion-group">
          <animateMotion
            dur={`${durationSec}s`}
            repeatCount="indefinite"
            rotate="auto"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.45 0 0.55 1"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
          <g transform={`translate(${-jetSize * 0.42}, ${-offsetY})`}>
            <FlatJetAircraft size={jetSize} showSpeedLines animated />
          </g>
        </g>
      )}
    </>
  );
}

interface LiveFlightTrackerProps {
  progress: number;
  inFlight?: boolean;
  size?: number;
}

/** Real-time tracker on the flight status progress bar */
export function LiveFlightTracker({ progress, inFlight = false, size = 36 }: LiveFlightTrackerProps) {
  const reducedMotion = useReducedMotion();
  const left = `calc(${Math.min(Math.max(progress, 4), 94)}% - ${size * 0.5}px)`;

  return (
    <motion.div
      className="pointer-events-none absolute -top-3 z-10"
      animate={{ left }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <motion.div
        animate={
          inFlight && !reducedMotion
            ? { y: [0, -5, 2, -3, 0], rotate: [0, 0.6, -0.4, 0.2, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={
          inFlight
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className="relative"
      >
        <FlatJetAircraft
          size={size}
          showSpeedLines={inFlight}
          animated={inFlight && !reducedMotion}
        />
        {inFlight && !reducedMotion ? (
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-400 flight-live-dot" />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
