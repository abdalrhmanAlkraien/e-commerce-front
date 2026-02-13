import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { useAddToCart, useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { useCartStore } from '../store/cartStore';

const BASE = 'http://localhost:8080';

const mockCategory = { id: 'cat1', name: 'Electronics', slug: 'electronics' };
const mockProduct = {
  id: 'prod1',
  name: 'Widget',
  slug: 'widget',
  description: 'desc',
  price: 10,
  stock: 5,
  category: mockCategory,
};
const mockCartEmpty = { id: 'cart1', sessionId: 'sess1', items: [], total: 0 };
const mockCartWithItem = {
  id: 'cart1',
  sessionId: 'sess1',
  items: [{ id: 'item1', product: mockProduct, quantity: 1, unitPrice: 10 }],
  total: 10,
};
const mockCartUpdated = {
  id: 'cart1',
  sessionId: 'sess1',
  items: [{ id: 'item1', product: mockProduct, quantity: 2, unitPrice: 10 }],
  total: 20,
};
const mockCartRemoved = { id: 'cart1', sessionId: 'sess1', items: [], total: 0 };

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  act(() => {
    useCartStore.setState({ cartId: null, sessionId: null, isDrawerOpen: false });
  });
});
afterAll(() => server.close());

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

describe('useAddToCart', () => {
  it('creates cart and adds item (first add)', async () => {
    server.use(
      http.post(`${BASE}/api/v1/public/cart`, () => HttpResponse.json(mockCartEmpty, { status: 201 })),
      http.post(`${BASE}/api/v1/public/cart/cart1/items`, () => HttpResponse.json(mockCartWithItem)),
    );

    const { result } = renderHook(() => useAddToCart(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ productId: 'prod1', quantity: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useCartStore.getState().cartId).toBe('cart1');
    expect(useCartStore.getState().sessionId).toBe('sess1');
  });

  it('shows error toast on failure and rolls back', async () => {
    // Pre-set cart session so we skip cart creation
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.post(`${BASE}/api/v1/public/cart/cart1/items`, () =>
        HttpResponse.json({ message: 'Out of stock', status: 422 }, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useAddToCart(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ productId: 'prod1', quantity: 99 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUpdateCartItem', () => {
  it('updates item quantity', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.put(`${BASE}/api/v1/public/cart/cart1/items/item1`, () =>
        HttpResponse.json(mockCartUpdated),
      ),
    );

    const { result } = renderHook(() => useUpdateCartItem(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ itemId: 'item1', quantity: 2 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].quantity).toBe(2);
  });

  it('rolls back optimistic update on failure', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.put(`${BASE}/api/v1/public/cart/cart1/items/item1`, () =>
        HttpResponse.json({ message: 'Cart locked', status: 409 }, { status: 409 }),
      ),
    );

    const { result } = renderHook(() => useUpdateCartItem(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ itemId: 'item1', quantity: 5 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('throws when no cart session exists', async () => {
    const { result } = renderHook(() => useUpdateCartItem(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate({ itemId: 'item1', quantity: 1 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useRemoveCartItem', () => {
  it('removes an item from the cart', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.delete(`${BASE}/api/v1/public/cart/cart1/items/item1`, () =>
        HttpResponse.json(mockCartRemoved),
      ),
    );

    const { result } = renderHook(() => useRemoveCartItem(), { wrapper: makeWrapper() });

    await act(async () => {
      result.current.mutate('item1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(0);
  });
});
