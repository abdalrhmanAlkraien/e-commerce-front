import { describe, it, expect, vi } from 'vitest';
import { toast } from 'sonner';
import { queryClient } from '../queryClient';
import { QueryClient } from '@tanstack/react-query';

describe('queryClient', () => {
  it('is an instance of QueryClient', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it('has staleTime set to 60_000', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(60_000);
  });

  it('has retry set to 2 for queries', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(2);
  });

  it('has refetchOnWindowFocus disabled', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });

  it('does not retry mutations', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.mutations?.retry).toBe(false);
  });

  it('has a mutation onError handler', () => {
    const defaults = queryClient.getDefaultOptions();
    expect(typeof defaults.mutations?.onError).toBe('function');
  });

  it('mutation onError invokes toast.error with a mapped message', () => {
    const toastSpy = vi.spyOn(toast, 'error').mockImplementation(() => undefined);

    const defaults = queryClient.getDefaultOptions();
    const onError = defaults.mutations?.onError as (err: unknown) => void;
    onError(new Error('test error'));

    expect(toastSpy).toHaveBeenCalledOnce();
    expect(toastSpy).toHaveBeenCalledWith(expect.any(String));

    vi.restoreAllMocks();
  });
});
