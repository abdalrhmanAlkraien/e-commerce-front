import { isApiError } from '@/shared/api/apiError';

const STATUS_MESSAGES: Record<number, string> = {
  0: 'Network error. Please try again.',
  401: 'Session expired.',
  403: 'Access denied.',
  404: 'The requested resource was not found.',
  500: 'Unexpected server error.',
};

export function mapApiErrorToMessage(error: unknown): string {
  if (isApiError(error)) {
    return STATUS_MESSAGES[error.status] ?? error.message ?? 'An error occurred.';
  }

  if (error instanceof Error) {
    return 'An unexpected error occurred.';
  }

  return 'An unexpected error occurred.';
}
