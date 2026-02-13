import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports a frozen env object with apiBaseUrl and appEnv', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080');
    vi.stubEnv('VITE_APP_ENV', 'development');

    const { env } = await import('../env');

    expect(env.apiBaseUrl).toBe('http://localhost:8080');
    expect(env.appEnv).toBe('development');
    expect(Object.isFrozen(env)).toBe(true);
  });

  it('throws when VITE_API_BASE_URL is missing', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    vi.stubEnv('VITE_APP_ENV', 'development');

    await expect(() => import('../env')).rejects.toThrow(
      'VITE_API_BASE_URL',
    );
  });

  it('throws when VITE_APP_ENV has an invalid value', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080');
    vi.stubEnv('VITE_APP_ENV', 'invalid');

    await expect(() => import('../env')).rejects.toThrow(
      'VITE_APP_ENV',
    );
  });
});
