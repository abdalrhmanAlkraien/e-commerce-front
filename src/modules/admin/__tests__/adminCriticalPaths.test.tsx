/**
 * Admin Critical Paths — Integration Tests
 *
 * Covers the highest-risk admin operations:
 *  ✅ Create product (loading → success → product returned)
 *  ✅ Create product → failure (API error surfaced)
 *  ✅ Update stock (partial update via PUT /admin/products/:id)
 *  ✅ Change order status (PUT /admin/orders/:externalId/status)
 *  ✅ Change order status → failure
 */
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { adminHandlers } from '@/shared/test/msw/handlers/admin.handlers';
import { mockProduct, mockOrder } from '@/shared/test/msw/fixtures';
import { useAdminCreateProduct, useAdminUpdateProduct } from '../hooks/useAdminProducts';
import { useAdminUpdateOrderStatus } from '../hooks/useAdminOrders';

const BASE = 'http://localhost:8080';

const server = setupServer(...adminHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  };
}

// ── Create product ────────────────────────────────────────────────────────────

describe('AdminCriticalPaths — create product', () => {
  it('loading → success: returns created product', async () => {
    const { result } = renderHook(() => useAdminCreateProduct(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        name: mockProduct.name,
        slug: mockProduct.slug,
        description: mockProduct.description,
        price: mockProduct.price,
        stock: mockProduct.stock,
        categoryId: 'cat-1',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe(mockProduct.name);
  });

  it('failure: sets isError when API returns 422', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    server.use(
      http.post(`${BASE}/api/v1/admin/products`, () =>
        HttpResponse.json(
          { message: 'Category not found', status: 422 },
          { status: 422 },
        ),
      ),
    );

    const { result } = renderHook(() => useAdminCreateProduct(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        name: 'Bad Product',
        slug: 'bad-product',
        description: 'desc',
        price: 9.99,
        stock: 1,
        categoryId: 'non-existent',
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    vi.restoreAllMocks();
  });
});

// ── Update stock ──────────────────────────────────────────────────────────────

describe('AdminCriticalPaths — update stock', () => {
  it('loading → success: returns updated product with new stock', async () => {
    const updatedStock = 50;
    server.use(
      http.put(`${BASE}/api/v1/admin/products/${mockProduct.id}`, async () =>
        HttpResponse.json({ ...mockProduct, stock: updatedStock }),
      ),
    );

    const { result } = renderHook(() => useAdminUpdateProduct(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: mockProduct.id, data: { stock: updatedStock } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.stock).toBe(updatedStock);
  });

  it('failure: sets isError when product is not found', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    server.use(
      http.put(`${BASE}/api/v1/admin/products/ghost-id`, () =>
        HttpResponse.json({ message: 'Product not found', status: 404 }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useAdminUpdateProduct(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({ id: 'ghost-id', data: { stock: 10 } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    vi.restoreAllMocks();
  });
});

// ── Change order status ───────────────────────────────────────────────────────

describe('AdminCriticalPaths — change order status', () => {
  it('loading → success: returns order with updated status', async () => {
    const { result } = renderHook(() => useAdminUpdateOrderStatus(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        externalId: mockOrder.externalId,
        data: { status: 'CONFIRMED' },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('CONFIRMED');
    expect(result.current.data?.externalId).toBe(mockOrder.externalId);
  });

  it('failure: sets isError when order is not found', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    server.use(
      http.put(`${BASE}/api/v1/admin/orders/ghost-order/status`, () =>
        HttpResponse.json({ message: 'Order not found', status: 404 }, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useAdminUpdateOrderStatus(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        externalId: 'ghost-order',
        data: { status: 'CONFIRMED' },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    vi.restoreAllMocks();
  });
});
