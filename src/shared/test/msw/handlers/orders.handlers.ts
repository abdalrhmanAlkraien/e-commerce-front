import { http, HttpResponse } from 'msw';
import { mockOrder } from '../fixtures';

const BASE = 'http://localhost:8080';

export const ordersHandlers = [
  http.post(`${BASE}/api/v1/checkout/create-order`, () =>
    HttpResponse.json(mockOrder, { status: 201 }),
  ),

  http.post(`${BASE}/api/v1/public/orders/:externalId/refund-request`, () =>
    HttpResponse.json(
      { id: 'refund-1', status: 'PENDING', amount: 10, reason: 'Test reason' },
      { status: 201 },
    ),
  ),
];
