import { http, HttpResponse } from 'msw';
import { mockCategory } from '../fixtures';

const BASE = 'http://localhost:8080';

export const categoriesHandlers = [
  http.get(`${BASE}/api/v1/public/categories`, () =>
    HttpResponse.json([mockCategory]),
  ),
];
