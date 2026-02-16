import { http, HttpResponse } from 'msw';
import {
  mockProduct,
  mockOrder,
  mockCategory,
  mockCustomer,
  mockCustomerPage,
  mockOrderPage,
} from '../fixtures';

const BASE = 'http://localhost:8080';

export const adminHandlers = [
  // ── Admin Categories ──────────────────────────────────────────────────────
  http.get(`${BASE}/api/v1/admin/categories`, () =>
    HttpResponse.json([mockCategory]),
  ),

  http.post(`${BASE}/api/v1/admin/categories`, async ({ request }) => {
    const body = await request.json() as { name: string; slug: string };
    return HttpResponse.json({ id: 'cat-new', ...body }, { status: 201 });
  }),

  http.put(`${BASE}/api/v1/admin/categories/:id`, async ({ request }) => {
    const body = await request.json() as Partial<{ name: string; slug: string }>;
    return HttpResponse.json({ ...mockCategory, ...body });
  }),

  http.delete(`${BASE}/api/v1/admin/categories/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // ── Admin Products ────────────────────────────────────────────────────────
  http.get(`${BASE}/api/v1/admin/products`, () =>
    HttpResponse.json({ items: [mockProduct], total: 1, page: 1, pageSize: 12 }),
  ),

  http.post(`${BASE}/api/v1/admin/products`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      { ...mockProduct, id: 'prod-new', ...body, category: mockCategory },
      { status: 201 },
    );
  }),

  http.put(`${BASE}/api/v1/admin/products/:id`, async ({ request }) => {
    const body = await request.json() as Partial<Record<string, unknown>>;
    return HttpResponse.json({ ...mockProduct, ...body, category: mockCategory });
  }),

  http.delete(`${BASE}/api/v1/admin/products/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // ── Admin Orders ──────────────────────────────────────────────────────────
  http.get(`${BASE}/api/v1/admin/orders`, () =>
    HttpResponse.json(mockOrderPage),
  ),

  http.get(`${BASE}/api/v1/admin/orders/:externalId`, () =>
    HttpResponse.json(mockOrder),
  ),

  http.put(`${BASE}/api/v1/admin/orders/:externalId/status`, async ({ request }) => {
    const body = await request.json() as { status: string };
    return HttpResponse.json({ ...mockOrder, status: body.status });
  }),

  http.post(`${BASE}/api/v1/admin/orders/:externalId/refund`, () =>
    HttpResponse.json({ ...mockOrder, status: 'REFUNDED' }),
  ),

  // ── Admin Customers ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/v1/admin/customers`, () =>
    HttpResponse.json(mockCustomerPage),
  ),

  http.get(`${BASE}/api/v1/admin/customers/:id`, () =>
    HttpResponse.json(mockCustomer),
  ),

  http.put(`${BASE}/api/v1/admin/customers/:id/enable`, () =>
    HttpResponse.json({ ...mockCustomer, enabled: true }),
  ),

  http.put(`${BASE}/api/v1/admin/customers/:id/disable`, () =>
    HttpResponse.json({ ...mockCustomer, enabled: false }),
  ),

  // ── Content Upload ────────────────────────────────────────────────────────
  http.post(`${BASE}/api/v1/content/upload`, () =>
    HttpResponse.json({ id: 'file-1', url: 'https://cdn.example.com/file-1.jpg' }),
  ),
];
