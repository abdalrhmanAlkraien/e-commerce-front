// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { isApiError } from '../apiError';

const BASE = 'http://localhost:8080';

const server = setupServer(
  http.get(`${BASE}/api/v1/public/products`, () => {
    return HttpResponse.json({ items: [] }, { status: 200 });
  }),
  http.get(`${BASE}/api/v1/unauthorized`, () => {
    return HttpResponse.json({ message: 'Token expired' }, { status: 401 });
  }),
  http.get(`${BASE}/api/v1/forbidden`, () => {
    return HttpResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }),
  http.get(`${BASE}/api/v1/server-error`, () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
});
afterAll(() => server.close());

describe('axiosClient configuration', () => {
  it('has the correct base URL and timeout', async () => {
    const { axiosClient } = await import('../axiosClient');
    expect(axiosClient.defaults.baseURL).toBe(BASE);
    expect(axiosClient.defaults.timeout).toBe(10_000);
    expect(axiosClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('request interceptor — token injection', () => {
  it('does NOT inject Authorization header when no token', async () => {
    const { axiosClient } = await import('../axiosClient');
    let capturedAuth: string | undefined;

    server.use(
      http.get(`${BASE}/api/v1/public/products`, ({ request }) => {
        capturedAuth = request.headers.get('authorization') ?? undefined;
        return HttpResponse.json({ items: [] });
      }),
    );

    await axiosClient.get('/api/v1/public/products');
    expect(capturedAuth).toBeUndefined();
  });

  it('injects Authorization: Bearer <token> when token is set', async () => {
    const { axiosClient } = await import('../axiosClient');
    useAuthStore.setState({ token: 'test-token-abc', isAuthenticated: true, user: null });

    let capturedAuth: string | null = null;

    server.use(
      http.get(`${BASE}/api/v1/public/products`, ({ request }) => {
        capturedAuth = request.headers.get('authorization');
        return HttpResponse.json({ items: [] });
      }),
    );

    await axiosClient.get('/api/v1/public/products');
    expect(capturedAuth).toBe('Bearer test-token-abc');
  });
});

describe('response interceptor — 401 logout', () => {
  it('calls logout on 401 response', async () => {
    const { axiosClient } = await import('../axiosClient');
    useAuthStore.setState({ token: 'stale-token', isAuthenticated: true, user: null });

    await expect(axiosClient.get('/api/v1/unauthorized')).rejects.toSatisfy(isApiError);

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe('response interceptor — error normalization', () => {
  it('normalizes 403 into ApiErrorInstance', async () => {
    const { axiosClient } = await import('../axiosClient');

    await expect(axiosClient.get('/api/v1/forbidden')).rejects.toSatisfy((err: unknown) => {
      if (!isApiError(err)) return false;
      return err.status === 403 && err.code === 'FORBIDDEN';
    });
  });

  it('normalizes 500 into ApiErrorInstance with status 500', async () => {
    const { axiosClient } = await import('../axiosClient');

    await expect(axiosClient.get('/api/v1/server-error')).rejects.toSatisfy((err: unknown) => {
      if (!isApiError(err)) return false;
      return err.status === 500;
    });
  });
});
