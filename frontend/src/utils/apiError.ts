import type { ApiError } from '../types';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: ApiError };
    message?: string;
  };

  const data = err.response?.data;
  if (data?.message) {
    return data.message;
  }
  if (data?.error) {
    return data.error;
  }
  if (data?.fieldErrors?.length) {
    return data.fieldErrors.map((f) => f.message).join('. ');
  }
  if (err.message === 'Network Error') {
    return 'Unable to reach the server. Is the backend running?';
  }
  return fallback;
}
