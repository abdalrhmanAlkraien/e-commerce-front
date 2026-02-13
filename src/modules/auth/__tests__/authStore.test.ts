import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '../store/authStore';
import { initAuthBroadcastSync } from '../utils/authBroadcast';

const mockUser = { id: '1', email: 'user@test.com', role: 'CUSTOMER' as const };

afterEach(() => {
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
  vi.unstubAllGlobals();
});

describe('authStore — setAuth', () => {
  it('stores token, user and sets isAuthenticated to true', () => {
    act(() => {
      useAuthStore.getState().setAuth('jwt-abc', mockUser);
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('jwt-abc');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });
});

describe('authStore — logout', () => {
  it('clears token, user and sets isAuthenticated to false', () => {
    act(() => {
      useAuthStore.getState().setAuth('jwt-abc', mockUser);
    });
    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('broadcasts logout to other tabs via BroadcastChannel', () => {
    const postMessageSpy = vi.fn();
    const closeSpy = vi.fn();

    class MockBC {
      postMessage = postMessageSpy;
      close = closeSpy;
    }
    vi.stubGlobal('BroadcastChannel', MockBC);

    act(() => {
      useAuthStore.getState().logout();
    });

    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'LOGOUT' });
    expect(closeSpy).toHaveBeenCalled();
  });

  it('does not throw when BroadcastChannel is unavailable', () => {
    vi.stubGlobal('BroadcastChannel', undefined);

    expect(() => {
      act(() => {
        useAuthStore.getState().logout();
      });
    }).not.toThrow();
  });
});

describe('authStore — initial state', () => {
  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('authBroadcast — initAuthBroadcastSync', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({ token: 'stale', user: mockUser, isAuthenticated: true });
    });
  });

  it('calls logout on the store when a LOGOUT message is received', () => {
    let savedOnMessage: ((event: MessageEvent) => void) | null = null;
    const closeSpy = vi.fn();

    class MockBC {
      set onmessage(handler: (event: MessageEvent) => void) {
        savedOnMessage = handler;
      }
      close = closeSpy;
    }
    vi.stubGlobal('BroadcastChannel', MockBC);

    const cleanup = initAuthBroadcastSync();

    act(() => {
      savedOnMessage?.({ data: { type: 'LOGOUT' } } as MessageEvent);
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    cleanup();
    expect(closeSpy).toHaveBeenCalled();
  });
});
