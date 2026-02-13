import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW Node server used in Vitest.
 * Import and start this in test files that require API mocking.
 */
export const server = setupServer(...handlers);
