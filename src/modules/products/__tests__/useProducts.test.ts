import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { useProducts, useProductDetails } from '../hooks/useProducts';

const BASE = 'http://localhost:8080';

const mockCategory = { id: 'cat1', name: 'Electronics', slug: 'electronics' };
const mockProduct = {
  id: 'p1',
  name: 'Widget',
  slug: 'widget',
  description: 'A great widget',
  price: 19.99,
  stock: 10,
  imageUrl: undefined,
  category: mockCategory,
};
const mockPage = { items: [mockProduct], total: 1, page: 1, pageSize: 12 };

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

describe('useProducts', () => {
  it('loads product listing', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/products`, () => HttpResponse.json(mockPage)),
    );

    const { result } = renderHook(() => useProducts({}), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].name).toBe('Widget');
  });

  it('passes filter params to the API', async () => {
    const capturedParams = new Map<string, string>();
    server.use(
      http.get(`${BASE}/api/v1/public/products`, ({ request }) => {
        const url = new URL(request.url);
        url.searchParams.forEach((v, k) => capturedParams.set(k, v));
        return HttpResponse.json(mockPage);
      }),
    );

    const { result } = renderHook(
      () => useProducts({ categorySlug: 'electronics', search: 'widget', page: 2 }),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(capturedParams.get('categorySlug')).toBe('electronics');
    expect(capturedParams.get('search')).toBe('widget');
    expect(capturedParams.get('page')).toBe('2');
  });

  it('surfaces error when API fails', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/products`, () =>
        HttpResponse.json({ message: 'Server Error', status: 500 }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useProducts({}), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useProductDetails', () => {
  it('returns product data by slug', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/products/widget`, () => HttpResponse.json(mockProduct)),
    );

    const { result } = renderHook(() => useProductDetails('widget'), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe('widget');
  });

  it('returns error on 404', async () => {
    server.use(
      http.get(`${BASE}/api/v1/public/products/not-found`, () =>
        HttpResponse.json({ message: 'Product not found', status: 404 }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useProductDetails('not-found'), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('is disabled when slug is empty', () => {
    const { result } = renderHook(() => useProductDetails(''), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
