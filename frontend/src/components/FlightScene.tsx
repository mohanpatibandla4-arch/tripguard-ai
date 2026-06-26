import { useMemo } from 'react';
import { FlyingJetHero } from './FlatJetAircraft';

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  variant: 'bright' | 'soft' | 'accent';
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: `${(id * 17 + 7) % 100}%`,
    top: `${(id * 23 + 11) % 100}%`,
    size: 1 + (id % 4),
    delay: (id * 0.7) % 18,
    duration: 14 + (id % 12),
    opacity: 0.15 + (id % 5) * 0.12,
    variant: id % 7 === 0 ? 'accent' : id % 3 === 0 ? 'bright' : 'soft',
  }));
}

export function FlightScene({ className = '' }: { className?: string }) {
  const particles = useMemo(() => createParticles(72), []);

  return (
    <div className={`flight-scene pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="flight-scene__sky" aria-hidden />
      <div className="flight-scene__aurora" aria-hidden />
      <div className="flight-scene__grid" aria-hidden />

      {particles.map((p) => (
        <span
          key={p.id}
          className={`flight-scene__particle flight-scene__particle--${p.variant}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
          aria-hidden
        />
      ))}

      <div className="flight-scene__glow flight-scene__glow--blue" aria-hidden />
      <div className="flight-scene__glow flight-scene__glow--yellow" aria-hidden />
      <FlyingJetHero size={200} className="opacity-90" />
      <div className="flight-scene__vignette" aria-hidden />
    </div>
  );
}
