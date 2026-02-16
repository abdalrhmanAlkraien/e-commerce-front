/**
 * Admin Pages — Render Tests
 *
 * Validates that each admin page renders its key content given MSW data.
 * Uses MemoryRouter so pages can render without a full browser router.
 */
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { adminHandlers } from '@/shared/test/msw/handlers/admin.handlers';
import {
  mockCategory,
  mockProduct,
  mockOrder,
  mockCustomer,
  mockDisabledCustomer,
} from '@/shared/test/msw/fixtures';
import { AdminCategoriesPage } from '../categories/pages/AdminCategoriesPage';
import { AdminProductsPage } from '../products/pages/AdminProductsPage';
import { AdminOrdersPage } from '../orders/pages/AdminOrdersPage';
import { AdminOrderDetailsPage } from '../orders/pages/AdminOrderDetailsPage';
import { AdminCustomersPage } from '../customers/pages/AdminCustomersPage';
import { AdminCustomerDetailsPage } from '../customers/pages/AdminCustomerDetailsPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

const BASE = 'http://localhost:8080';

const server = setupServer(...adminHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithProviders(
  ui: React.ReactElement,
  { path = '/', route = '/' }: { path?: string; route?: string } = {},
) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

describe('AdminDashboardPage', () => {
  it('renders heading', () => {
    renderWithProviders(<AdminDashboardPage />, { path: '/admin', route: '/admin' });
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});

// ── Categories ─────────────────────────────────────────────────────────────────

describe('AdminCategoriesPage', () => {
  it('renders category name from API', async () => {
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });
    await waitFor(() =>
      expect(screen.getByText(mockCategory.name)).toBeInTheDocument(),
    );
  });

  it('renders New Category button', async () => {
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new category/i })).toBeInTheDocument(),
    );
  });

  it('clicking "New Category" shows the create form (mode transitions)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new category/i })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: /new category/i }));

    // "New Category" button hidden when mode !== 'idle'
    expect(screen.queryByRole('button', { name: /new category/i })).not.toBeInTheDocument();
    // Form visible with "Create Category" heading
    expect(screen.getByText('Create Category')).toBeInTheDocument();
  });

  it('submitting create form calls createCategory and returns to idle', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new category/i })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: /new category/i }));
    await user.type(screen.getByLabelText(/name/i), 'Test Category');
    // Slug is auto-generated — submit the form
    await user.click(screen.getByRole('button', { name: /create/i }));

    // After successful mutation, mode returns to 'idle' and button reappears
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new category/i })).toBeInTheDocument(),
    );
  });

  it('clicking Delete opens the confirm modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });

    await waitFor(() => expect(screen.getByText(mockCategory.name)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveTextContent(mockCategory.name);
  });

  it('confirming delete closes the confirm modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });

    await waitFor(() => expect(screen.getByText(mockCategory.name)).toBeInTheDocument());

    // Open the delete modal
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Click confirm inside the dialog
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));

    // Modal closes after successful delete
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('cancelling delete closes the confirm modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminCategoriesPage />, { path: '/admin/categories', route: '/admin/categories' });

    await waitFor(() => expect(screen.getByText(mockCategory.name)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});

// ── Products ───────────────────────────────────────────────────────────────────

describe('AdminProductsPage', () => {
  it('renders product name from API', async () => {
    renderWithProviders(<AdminProductsPage />, { path: '/admin/products', route: '/admin/products' });
    await waitFor(() =>
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument(),
    );
  });

  it('renders New Product button', async () => {
    renderWithProviders(<AdminProductsPage />, { path: '/admin/products', route: '/admin/products' });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new product/i })).toBeInTheDocument(),
    );
  });
});

// ── Orders list ────────────────────────────────────────────────────────────────

describe('AdminOrdersPage', () => {
  it('renders order id from API', async () => {
    renderWithProviders(<AdminOrdersPage />, { path: '/admin/orders', route: '/admin/orders' });
    await waitFor(() =>
      expect(screen.getByText(mockOrder.externalId)).toBeInTheDocument(),
    );
  });

  it('renders order status badge', async () => {
    renderWithProviders(<AdminOrdersPage />, { path: '/admin/orders', route: '/admin/orders' });
    await waitFor(() =>
      expect(screen.getByText(mockOrder.status ?? 'PENDING')).toBeInTheDocument(),
    );
  });
});

// ── Order details ──────────────────────────────────────────────────────────────

describe('AdminOrderDetailsPage', () => {
  it('renders order externalId in heading', async () => {
    renderWithProviders(
      <AdminOrderDetailsPage />,
      {
        path: '/admin/orders/:externalId',
        route: `/admin/orders/${mockOrder.externalId}`,
      },
    );
    await waitFor(() =>
      expect(screen.getByText(new RegExp(mockOrder.externalId))).toBeInTheDocument(),
    );
  });

  it('renders shipping address when present', async () => {
    renderWithProviders(
      <AdminOrderDetailsPage />,
      {
        path: '/admin/orders/:externalId',
        route: `/admin/orders/${mockOrder.externalId}`,
      },
    );
    await waitFor(() =>
      // mockOrder has shippingAddress with street '123 Main St'
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument(),
    );
  });

  it('shows "No address on file" when shippingAddress is null', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/orders/:externalId`, () =>
        HttpResponse.json({ ...mockOrder, shippingAddress: null }),
      ),
    );
    renderWithProviders(
      <AdminOrderDetailsPage />,
      {
        path: '/admin/orders/:externalId',
        route: `/admin/orders/${mockOrder.externalId}`,
      },
    );
    await waitFor(() =>
      expect(screen.getByText(/no address on file/i)).toBeInTheDocument(),
    );
  });
});

// ── Customers list ─────────────────────────────────────────────────────────────

describe('AdminCustomersPage', () => {
  it('renders customer email from API', async () => {
    renderWithProviders(<AdminCustomersPage />, { path: '/admin/customers', route: '/admin/customers' });
    await waitFor(() =>
      expect(screen.getByText(mockCustomer.email)).toBeInTheDocument(),
    );
  });
});

// ── Customer details ───────────────────────────────────────────────────────────

describe('AdminCustomerDetailsPage', () => {
  it('renders customer email as heading', async () => {
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockCustomer.id}` },
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: mockCustomer.email })).toBeInTheDocument(),
    );
  });

  it('renders Enable/Disable button', async () => {
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockCustomer.id}` },
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /disable account/i }),
      ).toBeInTheDocument(),
    );
  });

  it('renders ENABLED status badge when customer is enabled', async () => {
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockCustomer.id}` },
    );
    await waitFor(() =>
      expect(screen.getByText('ENABLED')).toBeInTheDocument(),
    );
  });

  it('renders DISABLED status badge when customer is disabled', async () => {
    server.use(
      http.get(`${BASE}/api/v1/admin/customers/:id`, () =>
        HttpResponse.json(mockDisabledCustomer),
      ),
    );
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockDisabledCustomer.id}` },
    );
    await waitFor(() =>
      expect(screen.getByText('DISABLED')).toBeInTheDocument(),
    );
  });

  it('renders joined date when createdAt is present', async () => {
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockCustomer.id}` },
    );
    await waitFor(() =>
      // mockCustomer.createdAt = '2024-01-01T00:00:00.000Z'
      expect(screen.getByText(/joined/i)).toBeInTheDocument(),
    );
  });

  it('does not render joined date when createdAt is absent', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    server.use(
      http.get(`${BASE}/api/v1/admin/customers/:id`, () =>
        HttpResponse.json({ ...mockCustomer, createdAt: undefined }),
      ),
    );
    renderWithProviders(
      <AdminCustomerDetailsPage />,
      { path: '/admin/customers/:id', route: `/admin/customers/${mockCustomer.id}` },
    );
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: mockCustomer.email })).toBeInTheDocument(),
    );
    expect(screen.queryByText(/joined/i)).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
