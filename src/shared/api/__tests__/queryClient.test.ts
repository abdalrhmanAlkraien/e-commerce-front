import { describe, it, expect } from 'vitest';
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
});
