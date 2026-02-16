// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { contentApi } from '../contentApi';

const BASE = 'http://localhost:8080';

const server = setupServer(
  http.post(`${BASE}/api/v1/content/upload`, () =>
    HttpResponse.json({ id: 'file-1', url: 'https://cdn.example.com/file-1.jpg' }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('contentApi.upload', () => {
  it('uploads a file and returns id and url', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const result = await contentApi.upload(file);

    expect(result.id).toBe('file-1');
    expect(result.url).toBe('https://cdn.example.com/file-1.jpg');
  });

  it('sends multipart/form-data content type', async () => {
    let capturedContentType: string | null = null;
    server.use(
      http.post(`${BASE}/api/v1/content/upload`, ({ request }) => {
        capturedContentType = request.headers.get('content-type');
        return HttpResponse.json({ id: 'file-2', url: 'https://cdn.example.com/file-2.jpg' });
      }),
    );

    const file = new File(['data'], 'data.png', { type: 'image/png' });
    await contentApi.upload(file);

    // multipart/form-data includes a boundary — just check the prefix
    expect(capturedContentType).toMatch(/multipart\/form-data/i);
  });
});
