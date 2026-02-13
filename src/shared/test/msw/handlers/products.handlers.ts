import { http, HttpResponse } from 'msw';
import { mockProduct, mockPage } from '../fixtures';

const BASE = 'http://localhost:8080';

export const productsHandlers = [
  http.get(`${BASE}/api/v1/public/products`, () => HttpResponse.json(mockPage)),

  http.get(`${BASE}/api/v1/public/products/:slug`, ({ params }) => {
    if (params.slug === mockProduct.slug) {
      return HttpResponse.json(mockProduct);
    }
    return HttpResponse.json(
      { message: 'Product not found', status: 404 },
      { status: 404 },
    );
  }),
];
