import { describe, it, expect } from 'vitest';
import { ApiErrorInstance, isApiError } from '../apiError';

describe('ApiErrorInstance', () => {
  it('constructs with message, status and code', () => {
    const err = new ApiErrorInstance({ message: 'Not found', status: 404, code: 'NOT_FOUND' });
    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.name).toBe('ApiError');
  });

  it('constructs without code', () => {
    const err = new ApiErrorInstance({ message: 'Server error', status: 500 });
    expect(err.code).toBeUndefined();
  });

  it('is an instance of Error', () => {
    const err = new ApiErrorInstance({ message: 'fail', status: 400 });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiErrorInstance);
  });

  it('preserves prototype chain for instanceof checks', () => {
    const err = new ApiErrorInstance({ message: 'fail', status: 400 });
    expect(isApiError(err)).toBe(true);
  });
});

describe('isApiError', () => {
  it('returns true for ApiErrorInstance', () => {
    expect(isApiError(new ApiErrorInstance({ message: 'x', status: 400 }))).toBe(true);
  });

  it('returns false for plain Error', () => {
    expect(isApiError(new Error('plain'))).toBe(false);
  });

  it('returns false for null', () => {
    expect(isApiError(null)).toBe(false);
  });

  it('returns false for a plain object', () => {
    expect(isApiError({ message: 'x', status: 400 })).toBe(false);
  });
});
