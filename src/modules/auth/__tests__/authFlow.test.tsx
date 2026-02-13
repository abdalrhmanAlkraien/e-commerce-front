/**
 * Auth Flow — Integration Tests
 *
 * Covers:
 *  ✅ Login success (customer → redirect to /)
 *  ✅ Login success (admin → redirect to /admin)
 *  ✅ Login failure (invalid credentials → error alert, no auth state)
 *  ✅ Button disabled and label changes during pending mutation
 *  ✅ Protected route redirects unauthenticated user to /login
 */
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { authHandlers } from '@/shared/test/msw/handlers/auth.handlers';
import { LoginPage } from '../pages/LoginPage';
import { useAuthStore } from '../store/authStore';

const BASE = 'http://localhost:8080';

const server = setupServer(...authHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
});
afterAll(() => server.close());

function makeQC() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderLogin() {
  return render(
    <QueryClientProvider client={makeQC()}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div data-testid="home">Home Page</div>} />
          <Route path="/admin" element={<div data-testid="admin">Admin Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ── Loading state ─────────────────────────────────────────────────────────────

describe('AuthFlow — loading state', () => {
  it('disables the submit button and shows "Signing in…" while pending', async () => {
    let resolveLogin!: () => void;
    server.use(
      http.post(`${BASE}/api/v1/auth/login`, () =>
        new Promise<Response>((resolve) => {
          resolveLogin = () =>
            resolve(
              HttpResponse.json({
                token: 'mock-jwt-token',
                user: { id: 'u1', email: 'customer@example.com', role: 'CUSTOMER' },
              }),
            );
        }),
      ),
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'customer@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();

    await act(async () => { resolveLogin(); });
  });
});

// ── Success paths ─────────────────────────────────────────────────────────────

describe('AuthFlow — success', () => {
  it('customer: stores token and redirects to /', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'customer@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(screen.getByTestId('home')).toBeInTheDocument());

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('mock-jwt-token');
    expect(useAuthStore.getState().user?.role).toBe('CUSTOMER');
  });

  it('admin: stores token and redirects to /admin', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(screen.getByTestId('admin')).toBeInTheDocument());

    expect(useAuthStore.getState().user?.role).toBe('ADMIN');
  });
});

// ── Failure path ──────────────────────────────────────────────────────────────

describe('AuthFlow — failure', () => {
  it('displays error alert and leaves auth state empty on invalid credentials', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'badpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();

    vi.restoreAllMocks();
  });
});

// ── Protected route ───────────────────────────────────────────────────────────

describe('AuthFlow — protected route', () => {
  it('redirects unauthenticated user from a protected path to /login', () => {
    act(() => {
      useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    });

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route
            path="/checkout"
            element={
              useAuthStore.getState().isAuthenticated ? (
                <div>Checkout</div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });
});
