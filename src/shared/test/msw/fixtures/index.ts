import type { components } from '@/shared/types/api';

// ── Categories ──────────────────────────────────────────────────────────────

export const mockCategory: components['schemas']['CategoryDto'] = {
  id: 'cat-1',
  name: 'Electronics',
  slug: 'electronics',
};

// ── Products ─────────────────────────────────────────────────────────────────

export const mockProduct: components['schemas']['ProductDto'] = {
  id: 'prod-1',
  name: 'Widget Pro',
  slug: 'widget-pro',
  description: 'A great widget for everyday use',
  price: 29.99,
  stock: 10,
  category: mockCategory,
};

export const mockOutOfStockProduct: components['schemas']['ProductDto'] = {
  ...mockProduct,
  id: 'prod-oos',
  slug: 'widget-oos',
  stock: 0,
};

export const mockPage: {
  items: components['schemas']['ProductDto'][];
  total: number;
  page: number;
  pageSize: number;
} = {
  items: [mockProduct],
  total: 1,
  page: 1,
  pageSize: 12,
};

// ── Users ────────────────────────────────────────────────────────────────────

export const mockCustomerUser: components['schemas']['UserDto'] = {
  id: 'user-cust-1',
  email: 'customer@example.com',
  role: 'CUSTOMER',
};

export const mockAdminUser: components['schemas']['UserDto'] = {
  id: 'user-admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

// ── Auth Responses ────────────────────────────────────────────────────────────

export const mockAuthResponse: components['schemas']['AuthResponse'] = {
  token: 'mock-jwt-token',
  user: mockCustomerUser,
};

export const mockAdminAuthResponse: components['schemas']['AuthResponse'] = {
  token: 'mock-admin-jwt-token',
  user: mockAdminUser,
};

// ── Cart ─────────────────────────────────────────────────────────────────────

export const mockCartItem: components['schemas']['CartItemDto'] = {
  id: 'item-1',
  product: mockProduct,
  quantity: 1,
  unitPrice: 29.99,
};

export const mockCart: components['schemas']['CartDto'] = {
  id: 'cart-1',
  sessionId: 'sess-1',
  items: [mockCartItem],
  total: 29.99,
};

export const mockEmptyCart: components['schemas']['CartDto'] = {
  id: 'cart-1',
  sessionId: 'sess-1',
  items: [],
  total: 0,
};

export const mockCartUpdatedQty: components['schemas']['CartDto'] = {
  ...mockCart,
  items: [{ ...mockCartItem, quantity: 2 }],
  total: 59.98,
};

// ── Address / Orders ──────────────────────────────────────────────────────────

export const mockAddress: components['schemas']['AddressDto'] = {
  street: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  country: 'US',
  postalCode: '62701',
};

export const mockOrder: components['schemas']['OrderDto'] = {
  externalId: 'order-abc-123',
  status: 'PENDING',
  total: 29.99,
  items: [mockCartItem],
  shippingAddress: mockAddress,
  createdAt: new Date().toISOString(),
};
