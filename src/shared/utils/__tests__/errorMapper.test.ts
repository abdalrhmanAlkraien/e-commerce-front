import { describe, it, expect } from 'vitest';
import { mapApiErrorToMessage } from '../errorMapper';
import { ApiErrorInstance } from '@/shared/api/apiError';

describe('mapApiErrorToMessage', () => {
  it('returns "Network error" for status 0', () => {
    const err = new ApiErrorInstance({ message: 'network', status: 0 });
    expect(mapApiErrorToMessage(err)).toBe('Network error. Please try again.');
  });

  it('returns "Session expired." for 401', () => {
    const err = new ApiErrorInstance({ message: 'Unauthorized', status: 401 });
    expect(mapApiErrorToMessage(err)).toBe('Session expired.');
  });

  it('returns "Access denied." for 403', () => {
    const err = new ApiErrorInstance({ message: 'Forbidden', status: 403 });
    expect(mapApiErrorToMessage(err)).toBe('Access denied.');
  });

  it('returns "Unexpected server error." for 500', () => {
    const err = new ApiErrorInstance({ message: 'Internal', status: 500 });
    expect(mapApiErrorToMessage(err)).toBe('Unexpected server error.');
  });

  it('returns ApiError message for an unknown status code', () => {
    const err = new ApiErrorInstance({ message: 'Conflict', status: 409 });
    expect(mapApiErrorToMessage(err)).toBe('Conflict');
  });

  it('returns generic message for a plain Error', () => {
    expect(mapApiErrorToMessage(new Error('boom'))).toBe('An unexpected error occurred.');
  });

  it('returns generic message for null', () => {
    expect(mapApiErrorToMessage(null)).toBe('An unexpected error occurred.');
  });

  it('returns generic message for a plain string', () => {
    expect(mapApiErrorToMessage('something went wrong')).toBe('An unexpected error occurred.');
  });
});
