import { http, HttpResponse } from 'msw';
import { mockCart, mockEmptyCart, mockCartUpdatedQty } from '../fixtures';

const BASE = 'http://localhost:8080';

export const cartHandlers = [
  http.post(`${BASE}/api/v1/public/cart`, () =>
    HttpResponse.json(mockEmptyCart, { status: 201 }),
  ),

  http.get(`${BASE}/api/v1/public/cart/:cartId`, () => HttpResponse.json(mockCart)),

  http.post(`${BASE}/api/v1/public/cart/:cartId/items`, () =>
    HttpResponse.json(mockCart),
  ),

  http.put(`${BASE}/api/v1/public/cart/:cartId/items/:itemId`, () =>
    HttpResponse.json(mockCartUpdatedQty),
  ),

  http.delete(`${BASE}/api/v1/public/cart/:cartId/items/:itemId`, () =>
    HttpResponse.json(mockEmptyCart),
  ),
];
