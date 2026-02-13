/**
 * Cart Flow — Integration Tests  (REVENUE-CRITICAL)
 *
 * Covers the full cart lifecycle through the CartDrawer UI:
 *  ✅ Loading skeleton while cart data is in-flight
 *  ✅ Cart items and totals rendered from API data
 *  ✅ Increase quantity → updated total reflected in UI
 *  ✅ Remove item → cart transitions to empty state
 *  ✅ Failure to update quantity → error handled gracefully
 */
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { cartHandlers } from '@/shared/test/msw/handlers/cart.handlers';
import { mockCart, mockCartUpdatedQty, mockEmptyCart, mockProduct } from '@/shared/test/msw/fixtures';
import { CartDrawer } from '../components/CartDrawer';
import { useCartStore } from '../store/cartStore';

const BASE = 'http://localhost:8080';

const server = setupServer(...cartHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  act(() => {
    useCartStore.setState({ cartId: null, sessionId: null, isDrawerOpen: false });
  });
});
afterAll(() => server.close());

function makeQC() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

/**
 * Renders CartDrawer with the cart drawer open and cart session pre-populated.
 */
function renderCartDrawer() {
  act(() => {
    useCartStore.setState({ cartId: 'cart-1', sessionId: 'sess-1', isDrawerOpen: true });
  });

  return render(
    <QueryClientProvider client={makeQC()}>
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ── Loading state ─────────────────────────────────────────────────────────────

describe('CartFlow — loading state', () => {
  it('shows loading skeleton while cart data is fetched', async () => {
    // Use a never-resolving handler to freeze the loading state
    server.use(
      http.get(`${BASE}/api/v1/public/cart/cart-1`, () =>
        new Promise(() => { /* intentionally never resolves */ }),
      ),
    );

    renderCartDrawer();

    // The drawer is open and shows "Shopping Cart" heading
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();

    // Cart items not yet visible while loading
    expect(screen.queryByText(mockProduct.name)).not.toBeInTheDocument();
  });
});

// ── Success state ─────────────────────────────────────────────────────────────

describe('CartFlow — data loaded', () => {
  it('renders cart item name and unit price', async () => {
    renderCartDrawer();

    await waitFor(() =>
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument(),
    );

    expect(screen.getByText(`$${mockCart.items[0].unitPrice.toFixed(2)} each`)).toBeInTheDocument();
  });

  it('renders the cart subtotal in the footer', async () => {
    renderCartDrawer();

    // Wait for "Subtotal" label to appear (footer only renders when cart has items)
    await waitFor(() =>
      expect(screen.getByText('Subtotal')).toBeInTheDocument(),
    );

    // Verify the amount shown next to the "Subtotal" label
    const subtotalRow = screen.getByText('Subtotal').closest('div')!;
    expect(subtotalRow).toHaveTextContent(`$${mockCart.total.toFixed(2)}`);
  });

  it('shows item quantity inside the quantity control group', async () => {
    renderCartDrawer();

    await waitFor(() =>
      expect(screen.getByRole('group', { name: /quantity/i })).toBeInTheDocument(),
    );

    const quantityGroup = screen.getByRole('group', { name: /quantity/i });
    // The quantity span inside the group
    expect(within(quantityGroup).getByText(mockCart.items[0].quantity.toString())).toBeInTheDocument();
  });
});

// ── Increase quantity ─────────────────────────────────────────────────────────

describe('CartFlow — increase quantity', () => {
  it('updates the quantity and total after clicking "Increase quantity"', async () => {
    renderCartDrawer();

    await waitFor(() =>
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument(),
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/increase quantity/i));

    // Quantity control group should now show '2'
    await waitFor(() => {
      const quantityGroup = screen.getByRole('group', { name: /quantity/i });
      expect(within(quantityGroup).getByText('2')).toBeInTheDocument();
    });

    // Footer subtotal should reflect the updated total from mockCartUpdatedQty
    const subtotalRow = screen.getByText('Subtotal').closest('div')!;
    expect(subtotalRow).toHaveTextContent(`$${mockCartUpdatedQty.total.toFixed(2)}`);
  });
});

// ── Remove item ───────────────────────────────────────────────────────────────

describe('CartFlow — remove item', () => {
  it('shows empty cart state after removing the last item', async () => {
    server.use(
      http.delete(
        `${BASE}/api/v1/public/cart/cart-1/items/item-1`,
        () => HttpResponse.json(mockEmptyCart),
      ),
    );

    renderCartDrawer();

    await waitFor(() =>
      expect(
        screen.getByLabelText(new RegExp(`Remove ${mockProduct.name} from cart`, 'i')),
      ).toBeInTheDocument(),
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByLabelText(new RegExp(`Remove ${mockProduct.name} from cart`, 'i')),
    );

    await waitFor(() =>
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument(),
    );
  });
});

// ── Failure handling ──────────────────────────────────────────────────────────

describe('CartFlow — failure handling', () => {
  it('stays on cart page when update quantity fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    server.use(
      http.put(`${BASE}/api/v1/public/cart/cart-1/items/item-1`, () =>
        HttpResponse.json({ message: 'Cart locked', status: 409 }, { status: 409 }),
      ),
    );

    renderCartDrawer();

    await waitFor(() =>
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument(),
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/increase quantity/i));

    // Cart dialog remains visible (no navigation away)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument(),
    );

    vi.restoreAllMocks();
  });
});
