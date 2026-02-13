import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW Service Worker used for browser-based development mocking.
 * Start with `worker.start()` in main.tsx when VITE_APP_ENV=development.
 */
export const worker = setupWorker(...handlers);
