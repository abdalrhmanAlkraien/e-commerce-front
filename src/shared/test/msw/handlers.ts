import type { RequestHandler } from 'msw';
import { authHandlers } from './handlers/auth.handlers';
import { categoriesHandlers } from './handlers/categories.handlers';
import { productsHandlers } from './handlers/products.handlers';
import { cartHandlers } from './handlers/cart.handlers';
import { ordersHandlers } from './handlers/orders.handlers';
import { adminHandlers } from './handlers/admin.handlers';

/**
 * All MSW request handlers, organized by domain.
 * Composed into a single array for the server and browser worker.
 */
export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...categoriesHandlers,
  ...productsHandlers,
  ...cartHandlers,
  ...ordersHandlers,
  ...adminHandlers,
];
