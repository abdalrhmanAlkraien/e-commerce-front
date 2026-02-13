import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useCartStore } from '../store/cartStore';

beforeEach(() => {
  localStorage.clear();
  act(() => {
    useCartStore.setState({
      cartId: null,
      sessionId: null,
      isDrawerOpen: false,
    });
  });
});

describe('cartStore', () => {
  it('starts with null session', () => {
    expect(useCartStore.getState().cartId).toBeNull();
    expect(useCartStore.getState().sessionId).toBeNull();
  });

  it('setSession updates state and persists to localStorage', () => {
    act(() => {
      useCartStore.getState().setSession('cart-1', 'session-abc');
    });

    expect(useCartStore.getState().cartId).toBe('cart-1');
    expect(useCartStore.getState().sessionId).toBe('session-abc');

    const stored = JSON.parse(localStorage.getItem('cart_session') ?? '{}');
    expect(stored.cartId).toBe('cart-1');
    expect(stored.sessionId).toBe('session-abc');
  });

  it('clearSession resets state and removes localStorage', () => {
    act(() => {
      useCartStore.getState().setSession('cart-1', 'session-abc');
      useCartStore.getState().clearSession();
    });

    expect(useCartStore.getState().cartId).toBeNull();
    expect(useCartStore.getState().sessionId).toBeNull();
    expect(localStorage.getItem('cart_session')).toBeNull();
  });

  it('openDrawer and closeDrawer toggle isDrawerOpen', () => {
    expect(useCartStore.getState().isDrawerOpen).toBe(false);

    act(() => {
      useCartStore.getState().openDrawer();
    });
    expect(useCartStore.getState().isDrawerOpen).toBe(true);

    act(() => {
      useCartStore.getState().closeDrawer();
    });
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });
});
