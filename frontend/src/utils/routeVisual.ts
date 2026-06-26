const GRADIENTS = [
  'from-eu-blue via-eu-blue-light to-indigo-500',
  'from-eu-navy via-eu-blue to-sky-500',
  'from-eu-red via-rose-600 to-eu-yellow',
  'from-indigo-700 via-eu-blue to-cyan-500',
  'from-eu-blue via-violet-600 to-eu-red',
  'from-slate-800 via-eu-blue to-eu-yellow',
] as const;

function hashCode(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function routeGradient(departure: string, arrival: string): string {
  const key = `${departure}-${arrival}`;
  return GRADIENTS[hashCode(key) % GRADIENTS.length];
}

export function routeEmoji(departure: string, arrival: string): string {
  const emojis = ['✈️', '🌍', '🏔️', '🌅', '🗺️', '🏝️'];
  return emojis[hashCode(`${departure}${arrival}`) % emojis.length];
}
