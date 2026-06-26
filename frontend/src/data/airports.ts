export interface Airport {
  code: string;
  city: string;
  country: string;
}

/** Major European airports for origin/destination selection */
export const EUROPEAN_AIRPORTS: Airport[] = [
  { code: 'HEL', city: 'Helsinki', country: 'Finland' },
  { code: 'OUL', city: 'Oulu', country: 'Finland' },
  { code: 'TMP', city: 'Tampere', country: 'Finland' },
  { code: 'ARN', city: 'Stockholm Arlanda', country: 'Sweden' },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark' },
  { code: 'OSL', city: 'Oslo', country: 'Norway' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'BRU', city: 'Brussels', country: 'Belgium' },
  { code: 'CDG', city: 'Paris Charles de Gaulle', country: 'France' },
  { code: 'ORY', city: 'Paris Orly', country: 'France' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', city: 'Munich', country: 'Germany' },
  { code: 'BER', city: 'Berlin', country: 'Germany' },
  { code: 'LHR', city: 'London Heathrow', country: 'United Kingdom' },
  { code: 'LGW', city: 'London Gatwick', country: 'United Kingdom' },
  { code: 'MAN', city: 'Manchester', country: 'United Kingdom' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland' },
  { code: 'MAD', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal' },
  { code: 'FCO', city: 'Rome Fiumicino', country: 'Italy' },
  { code: 'MXP', city: 'Milan Malpensa', country: 'Italy' },
  { code: 'VIE', city: 'Vienna', country: 'Austria' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland' },
  { code: 'GVA', city: 'Geneva', country: 'Switzerland' },
  { code: 'WAW', city: 'Warsaw', country: 'Poland' },
  { code: 'PRG', city: 'Prague', country: 'Czech Republic' },
  { code: 'BUD', city: 'Budapest', country: 'Hungary' },
  { code: 'ATH', city: 'Athens', country: 'Greece' },
  { code: 'IST', city: 'Istanbul', country: 'Türkiye' },
  { code: 'RIX', city: 'Riga', country: 'Latvia' },
  { code: 'TLL', city: 'Tallinn', country: 'Estonia' },
  { code: 'VNO', city: 'Vilnius', country: 'Lithuania' },
  { code: 'KEF', city: 'Reykjavik', country: 'Iceland' },
];

export function findAirport(code: string): Airport | undefined {
  return EUROPEAN_AIRPORTS.find((a) => a.code === code.toUpperCase());
}
