import { http, HttpResponse } from 'msw';
import { mockAuthResponse, mockAdminAuthResponse } from '../fixtures';

const BASE = 'http://localhost:8080';

export const authHandlers = [
  http.post(`${BASE}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (body.email === 'admin@example.com' && body.password === 'password') {
      return HttpResponse.json(mockAdminAuthResponse);
    }

    if (body.email === 'customer@example.com' && body.password === 'password') {
      return HttpResponse.json(mockAuthResponse);
    }

    return HttpResponse.json(
      { message: 'Invalid credentials', status: 401 },
      { status: 401 },
    );
  }),

  http.post(`${BASE}/api/v1/auth/register`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
    return HttpResponse.json(
      { token: 'new-user-token', user: { id: 'user-new', email: body.email, role: 'CUSTOMER' } },
      { status: 201 },
    );
  }),
];
