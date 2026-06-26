import { apiClient } from './client';
import type { Booking, CreateBookingRequest, FlightStatusEvent } from '../types';

export async function getBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>('/bookings');
  return data;
}

export async function getBookingById(id: string): Promise<Booking> {
  const { data } = await apiClient.get<Booking>(`/bookings/${id}`);
  return data;
}

export async function createBooking(payload: CreateBookingRequest): Promise<Booking> {
  const { data } = await apiClient.post<Booking>('/bookings', payload);
  return data;
}

export async function trackFlightStatus(bookingId: string): Promise<FlightStatusEvent> {
  const { data } = await apiClient.post<FlightStatusEvent>(
    `/bookings/${bookingId}/flight-status/track`,
  );
  return data;
}

export async function getFlightStatusEvents(bookingId: string): Promise<FlightStatusEvent[]> {
  const { data } = await apiClient.get<FlightStatusEvent[]>(
    `/bookings/${bookingId}/flight-status/events`,
  );
  return data;
}
