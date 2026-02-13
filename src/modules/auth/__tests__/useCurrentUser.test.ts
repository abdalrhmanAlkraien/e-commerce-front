import { describe, it, expect, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuthStore } from '../store/authStore';

afterEach(() => {
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
});

describe('useCurrentUser', () => {
  it('returns null user and false isAuthenticated when not logged in', () => {
    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.role).toBeNull();
  });

  it('returns user, role and isAuthenticated=true after setAuth', () => {
    act(() => {
      useAuthStore.getState().setAuth('token-xyz', {
        id: '42',
        email: 'customer@test.com',
        role: 'CUSTOMER',
      });
    });

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user?.email).toBe('customer@test.com');
    expect(result.current.role).toBe('CUSTOMER');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns ADMIN role for admin user', () => {
    act(() => {
      useAuthStore.getState().setAuth('admin-token', {
        id: '1',
        email: 'admin@test.com',
        role: 'ADMIN',
      });
    });

    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.role).toBe('ADMIN');
  });
});
