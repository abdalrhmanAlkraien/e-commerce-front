import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { act } from '@testing-library/react';
import { RegisterPage } from '../pages/RegisterPage';
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
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
}

function renderRegister() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<p>Home page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('RegisterPage — rendering', () => {
  it('renders all required fields', () => {
    renderRegister();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders a link back to login', () => {
    renderRegister();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });
});

describe('RegisterPage — validation', () => {
  it('shows first name error on empty submit', async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
  });

  it('shows password length error when password is too short', async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(
      await screen.findByText('Password must be at least 8 characters.'),
    ).toBeInTheDocument();
  });
});

describe('RegisterPage — registration success', () => {
  it('stores auth and redirects to home on successful registration', async () => {
    server.use(
      http.post(`${BASE}/api/v1/auth/register`, () =>
        HttpResponse.json(
          {
            token: 'new-jwt',
            user: { id: '99', email: 'jane@test.com', role: 'CUSTOMER' },
          },
          { status: 201 },
        ),
      ),
    );

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@test.com');
    await user.type(screen.getByLabelText(/password/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('new-jwt');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    expect(await screen.findByText('Home page')).toBeInTheDocument();
  });
});

describe('RegisterPage — registration failure', () => {
  it('shows error message and leaves store unchanged on 400', async () => {
    server.use(
      http.post(`${BASE}/api/v1/auth/register`, () =>
        HttpResponse.json({ message: 'Email already in use' }, { status: 400 }),
      ),
    );

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'existing@test.com');
    await user.type(screen.getByLabelText(/password/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
