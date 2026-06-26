export type BookingStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type JourneyType = 'FLIGHT' | 'TRAIN' | 'BUS';
export type FlightStatus = 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DIVERTED' | 'DEPARTED' | 'LANDED';
export type NotificationChannel = 'EMAIL' | 'SMS';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  timezone: string;
  emailAlertsEnabled: boolean;
  smsAlertsEnabled: boolean;
}

export interface UpdateProfileRequest {
  phoneNumber?: string;
  emailAlertsEnabled?: boolean;
  smsAlertsEnabled?: boolean;
}

export interface NotificationConfig {
  emailProviderConfigured: boolean;
  smsProviderConfigured: boolean;
  whatsAppProviderConfigured: boolean;
}

export interface Booking {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  bookingReference?: string;
  journeyType: JourneyType;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingRequest {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  bookingReference?: string;
  journeyType?: JourneyType;
}

export interface FlightStatusEvent {
  id: string;
  bookingId: string;
  status: FlightStatus;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  delayMinutes: number;
  gate?: string;
  terminal?: string;
  fetchedAt: string;
}

export interface NotificationAttempt {
  id: string;
  bookingId?: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  subject?: string;
  message: string;
  attemptedAt: string;
  errorMessage?: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  fieldErrors?: Array<{ field: string; message: string }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  repliedAt: string;
  cards?: ChatCard[];
}

export interface ChatCard {
  title: string;
  subtitle: string;
  imageUrl: string;
  actionUrl: string;
}

export interface Airport {
  code: string;
  city: string;
  country: string;
  region?: string;
}

export interface PopularRoute {
  originCode: string;
  originCity: string;
  originCountry: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  imageUrl: string;
  dateHint: string;
  tripType: string;
}

export interface WeatherResponse {
  airportCode: string;
  city: string;
  country: string;
  temperatureC: number;
  weatherCode: number;
  condition: string;
  summary: string;
  humidityPercent: number;
  windSpeedKmh: number;
}

export interface TestAlertResponse {
  message: string;
  emailSent: boolean;
  smsSent: boolean;
  emailDetail: string;
  smsDetail: string;
}
