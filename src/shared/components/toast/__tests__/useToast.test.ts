import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from '../useToast';

const mocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
  promise: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: mocks,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useToast', () => {
  it('calls toast.success with 4000ms duration', () => {
    const { result } = renderHook(() => useToast());
    result.current.success('Saved!');
    expect(mocks.success).toHaveBeenCalledWith('Saved!', { duration: 4000 });
  });

  it('calls toast.error with 6000ms duration', () => {
    const { result } = renderHook(() => useToast());
    result.current.error('Something went wrong');
    expect(mocks.error).toHaveBeenCalledWith('Something went wrong', { duration: 6000 });
  });

  it('calls toast.loading with Infinity duration', () => {
    const { result } = renderHook(() => useToast());
    result.current.loading('Uploading...');
    expect(mocks.loading).toHaveBeenCalledWith('Uploading...', { duration: Infinity });
  });

  it('calls toast.dismiss with provided id', () => {
    const { result } = renderHook(() => useToast());
    result.current.dismiss('toast-123');
    expect(mocks.dismiss).toHaveBeenCalledWith('toast-123');
  });

  it('calls toast.dismiss without args', () => {
    const { result } = renderHook(() => useToast());
    result.current.dismiss();
    expect(mocks.dismiss).toHaveBeenCalledWith(undefined);
  });

  it('exposes toast.promise reference', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.promise).toBe(mocks.promise);
  });
});
