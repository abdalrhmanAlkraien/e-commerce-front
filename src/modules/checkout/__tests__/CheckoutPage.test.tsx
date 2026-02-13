import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { act } from '@testing-library/react';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { useCartStore } from '@/modules/cart/store/cartStore';

const BASE = 'http://localhost:8080';

const mockProduct = {
  id: 'p1', name: 'Widget', slug: 'widget', description: 'desc',
  price: 10, stock: 5, category: { id: 'c1', name: 'Tech', slug: 'tech' },
};
const mockCart = {
  id: 'cart1',
  sessionId: 'sess1',
  items: [{ id: 'item1', product: mockProduct, quantity: 1, unitPrice: 10 }],
  total: 10,
};
const mockOrder = {
  externalId: 'order-xyz',
  status: 'PENDING',
  total: 10,
  items: mockCart.items,
  shippingAddress: { street: '123 Main St', city: 'Springfield', state: 'IL', country: 'US', postalCode: '62701' },
  createdAt: new Date().toISOString(),
};

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

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderCheckout() {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:externalId" element={<ConfirmationPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CheckoutPage — rendering', () => {
  it('renders the shipping address form', () => {
    renderCheckout();
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal/i)).toBeInTheDocument();
  });
});

describe('CheckoutPage — validation', () => {
  it('shows validation errors on empty submit', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.get(`${BASE}/api/v1/public/cart/cart1`, () => HttpResponse.json(mockCart)),
    );

    const user = userEvent.setup();
    renderCheckout();

    // Wait for cart to load so button is enabled
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /place order/i })).not.toBeDisabled(),
    );

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText('Street is required.')).toBeInTheDocument();
  });
});

describe('CheckoutPage — success flow', () => {
  it('submits form and redirects to confirmation page', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.get(`${BASE}/api/v1/public/cart/cart1`, () => HttpResponse.json(mockCart)),
      http.post(`${BASE}/api/v1/checkout/create-order`, () =>
        HttpResponse.json(mockOrder, { status: 201 }),
      ),
    );

    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByLabelText(/street/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'Springfield');
    await user.type(screen.getByLabelText(/state/i), 'IL');
    await user.type(screen.getByLabelText(/country/i), 'US');
    await user.type(screen.getByLabelText(/postal/i), '62701');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });

    expect(screen.getByText('order-xyz')).toBeInTheDocument();
  });
});

describe('CheckoutPage — failure', () => {
  it('displays error toast on API failure', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    server.use(
      http.get(`${BASE}/api/v1/public/cart/cart1`, () => HttpResponse.json(mockCart)),
      http.post(`${BASE}/api/v1/checkout/create-order`, () =>
        HttpResponse.json({ message: 'Cart is locked', status: 422 }, { status: 422 }),
      ),
    );

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByLabelText(/street/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'Springfield');
    await user.type(screen.getByLabelText(/state/i), 'IL');
    await user.type(screen.getByLabelText(/country/i), 'US');
    await user.type(screen.getByLabelText(/postal/i), '62701');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    // Still on checkout page (not redirected)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it('disables submit button while mutation is pending', async () => {
    act(() => {
      useCartStore.setState({ cartId: 'cart1', sessionId: 'sess1' });
    });

    let resolveRequest!: () => void;
    server.use(
      http.get(`${BASE}/api/v1/public/cart/cart1`, () => HttpResponse.json(mockCart)),
      http.post(`${BASE}/api/v1/checkout/create-order`, () =>
        new Promise<Response>((resolve) => {
          resolveRequest = () => resolve(HttpResponse.json(mockOrder, { status: 201 }));
        }),
      ),
    );

    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByLabelText(/street/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'Springfield');
    await user.type(screen.getByLabelText(/state/i), 'IL');
    await user.type(screen.getByLabelText(/country/i), 'US');
    await user.type(screen.getByLabelText(/postal/i), '62701');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByRole('button', { name: /placing order/i })).toBeDisabled();

    await act(async () => {
      resolveRequest();
    });
  });
});
