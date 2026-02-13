import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { RefundForm } from '../components/RefundForm';

const BASE = 'http://localhost:8080';

const mockRefundResponse = {
  id: 'refund-1',
  orderId: 'order-abc',
  amount: 9.99,
  reason: 'Product was defective upon arrival',
  status: 'PENDING' as const,
  createdAt: new Date().toISOString(),
};

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderRefundForm(externalId = 'order-abc', maxRefundable?: number) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <RefundForm externalId={externalId} maxRefundable={maxRefundable} />
    </QueryClientProvider>,
  );
}

describe('RefundForm — rendering', () => {
  it('renders amount and reason fields', () => {
    renderRefundForm();
    expect(screen.getByLabelText(/refund amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit refund/i })).toBeInTheDocument();
  });

  it('shows max refundable in label when provided', () => {
    renderRefundForm('order-abc', 50);
    expect(screen.getByText(/max \$50\.00/i)).toBeInTheDocument();
  });
});

describe('RefundForm — validation', () => {
  it('shows error for short reason', async () => {
    const user = userEvent.setup();
    renderRefundForm();

    await user.type(screen.getByLabelText(/refund amount/i), '10');
    await user.type(screen.getByLabelText(/reason/i), 'short');
    await user.click(screen.getByRole('button', { name: /submit refund/i }));

    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
  });

  it('shows error for zero amount', async () => {
    const user = userEvent.setup();
    renderRefundForm();

    await user.type(screen.getByLabelText(/refund amount/i), '0');
    await user.type(screen.getByLabelText(/reason/i), 'This is a long enough reason for testing');
    await user.click(screen.getByRole('button', { name: /submit refund/i }));

    expect(await screen.findByText(/greater than zero/i)).toBeInTheDocument();
  });
});

describe('RefundForm — success', () => {
  it('shows PENDING status after successful submission', async () => {
    server.use(
      http.post(`${BASE}/api/v1/public/orders/order-abc/refund-request`, () =>
        HttpResponse.json(mockRefundResponse),
      ),
    );

    const user = userEvent.setup();
    renderRefundForm();

    await user.type(screen.getByLabelText(/refund amount/i), '9.99');
    await user.type(screen.getByLabelText(/reason/i), 'Product was defective upon arrival');
    await user.click(screen.getByRole('button', { name: /submit refund/i }));

    await waitFor(() => {
      expect(screen.getByText(/refund request submitted/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/pending review/i)).toBeInTheDocument();
    expect(screen.getByText(/\$9\.99/)).toBeInTheDocument();
  });
});

describe('RefundForm — failure', () => {
  it('keeps the form on server error', async () => {
    server.use(
      http.post(`${BASE}/api/v1/public/orders/order-abc/refund-request`, () =>
        HttpResponse.json({ message: 'Refund exceeds order total', status: 422 }, { status: 422 }),
      ),
    );

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const user = userEvent.setup();
    renderRefundForm();

    await user.type(screen.getByLabelText(/refund amount/i), '9999');
    await user.type(screen.getByLabelText(/reason/i), 'This is a long enough reason for testing');
    await user.click(screen.getByRole('button', { name: /submit refund/i }));

    await waitFor(() => {
      // Form should still be present (not replaced with success UI)
      expect(screen.getByRole('button', { name: /submit refund/i })).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });
});
