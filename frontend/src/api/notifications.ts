import { apiClient } from './client';
import type {
  NotificationAttempt,
  NotificationConfig,
  TestAlertResponse,
  UpdateProfileRequest,
  UserResponse,
} from '../types';

export async function getNotifications(bookingId?: string): Promise<NotificationAttempt[]> {
  const { data } = await apiClient.get<NotificationAttempt[]>('/notifications', {
    params: bookingId ? { bookingId } : undefined,
  });
  return data;
}

export async function getNotificationConfig(): Promise<NotificationConfig> {
  const { data } = await apiClient.get<NotificationConfig>('/notifications/config');
  return data;
}

export async function sendTestAlert(): Promise<TestAlertResponse> {
  const { data } = await apiClient.post<TestAlertResponse>('/notifications/test');
  return data;
}

export async function getProfile(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>('/users/me');
  return data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  const { data } = await apiClient.patch<UserResponse>('/users/me', payload);
  return data;
}

/** @deprecated Use updateProfile */
export async function updatePhoneNumber(phoneNumber: string): Promise<UserResponse> {
  return updateProfile({ phoneNumber });
}
