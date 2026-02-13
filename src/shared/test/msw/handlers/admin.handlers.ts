import { http, HttpResponse } from 'msw';
import { mockProduct, mockOrder, mockCategory } from '../fixtures';

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
    HttpResponse.json({ items: [mockOrder], total: 1, page: 1, pageSize: 20 }),
  ),

  http.get(`${BASE}/api/v1/admin/orders/:externalId`, () =>
    HttpResponse.json(mockOrder),
  ),

  http.put(`${BASE}/api/v1/admin/orders/:externalId/status`, async ({ request }) => {
    const body = await request.json() as { status: string };
    return HttpResponse.json({ ...mockOrder, status: body.status });
  }),
];
