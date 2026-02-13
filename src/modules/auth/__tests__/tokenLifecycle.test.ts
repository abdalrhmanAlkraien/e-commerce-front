// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useAuthStore } from '../store/authStore';

const BASE = 'http://localhost:8080';

const server = setupServer(
  http.get(`${BASE}/api/v1/unauthorized`, () =>
    HttpResponse.json({ message: 'Token expired' }, { status: 401 }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe('Token lifecycle — 401 auto-logout', () => {
  it('clears auth store on 401 response', async () => {
    const { axiosClient } = await import('@/shared/api/axiosClient');
    useAuthStore.setState({
      token: 'stale-token',
      isAuthenticated: true,
      user: { id: '1', email: 'u@test.com', role: 'CUSTOMER' },
    });

    await expect(axiosClient.get('/api/v1/unauthorized')).rejects.toThrow();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('calls toast.error with session expired message on 401', async () => {
    const toastMod = await import('sonner');
    const toastSpy = vi.spyOn(toastMod.toast, 'error').mockImplementation(() => 'mock-id');

    const { axiosClient } = await import('@/shared/api/axiosClient');
    useAuthStore.setState({ token: 'stale-token', isAuthenticated: true, user: null });

    await expect(axiosClient.get('/api/v1/unauthorized')).rejects.toThrow();

    expect(toastSpy).toHaveBeenCalledWith('Session expired. Please log in again.');
  });
});
