import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { act } from '@testing-library/react';
import { LoginPage } from '../pages/LoginPage';
import { useAuthStore } from '../store/authStore';

const BASE = 'http://localhost:8080';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  act(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });
});
afterAll(() => server.close());

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
}

function renderLogin(initialPath = '/login') {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Home page</p>} />
          <Route path="/admin" element={<p>Admin page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage — rendering', () => {
  it('renders email, password fields and submit button', () => {
    renderLogin();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders a link to the register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /create one/i })).toBeInTheDocument();
  });
});

describe('LoginPage — validation', () => {
  it('shows email error when submitted empty', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('shows password error when password is empty', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Password is required.')).toBeInTheDocument();
  });
});

describe('LoginPage — login success', () => {
  it('stores auth and redirects CUSTOMER to home on success', async () => {
    server.use(
      http.post(`${BASE}/api/v1/auth/login`, () =>
        HttpResponse.json({
          token: 'jwt-customer',
          user: { id: '1', email: 'customer@test.com', role: 'CUSTOMER' },
        }),
      ),
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'customer@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('jwt-customer');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    expect(await screen.findByText('Home page')).toBeInTheDocument();
  });

  it('stores auth and redirects ADMIN to /admin on success', async () => {
    server.use(
      http.post(`${BASE}/api/v1/auth/login`, () =>
        HttpResponse.json({
          token: 'jwt-admin',
          user: { id: '2', email: 'admin@test.com', role: 'ADMIN' },
        }),
      ),
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'adminpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('jwt-admin');
    });

    expect(await screen.findByText('Admin page')).toBeInTheDocument();
  });
});

describe('LoginPage — login failure', () => {
  it('displays error message and leaves store unchanged on 401', async () => {
    server.use(
      http.post(`${BASE}/api/v1/auth/login`, () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    // Silence the expected 401 toast
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    vi.restoreAllMocks();
  });

  it('disables the submit button while the mutation is pending', async () => {
    let resolveRequest!: () => void;
    server.use(
      http.post(`${BASE}/api/v1/auth/login`, () =>
        new Promise<Response>((resolve) => {
          resolveRequest = () =>
            resolve(
              HttpResponse.json({
                token: 'jwt',
                user: { id: '1', email: 'u@t.com', role: 'CUSTOMER' },
              }),
            );
        }),
      ),
    );

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'u@t.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();

    await act(async () => {
      resolveRequest();
    });
  });
});
