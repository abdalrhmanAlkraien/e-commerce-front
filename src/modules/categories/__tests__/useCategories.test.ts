import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { useCategories } from '../hooks/useCategories';

const BASE = 'http://localhost:8080';

const mockCategories = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Clothing', slug: 'clothing' },
];

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

describe('useCategories', () => {
  it('returns categories on success', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/categories`, () => HttpResponse.json(mockCategories)),
    );

    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCategories);
  });

  it('handles network error', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/categories`, () =>
        HttpResponse.json({ message: 'Internal Server Error', status: 500 }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('returns empty array when backend returns []', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/categories`, () => HttpResponse.json([])),
    );

    const { result } = renderHook(() => useCategories(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
