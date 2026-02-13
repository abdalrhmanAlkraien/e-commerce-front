/**
 * AUTO-GENERATED — DO NOT EDIT MANUALLY.
 *
 * Regenerate with: npm run generate:types
 * Source: http://localhost:8080/api-docs
 *
 * This file is a bootstrap stub. Run the generate script when the backend is available
 * to replace this with types derived from the live OpenAPI specification.
 */

export interface paths {
  '/api/v1/auth/register': {
    post: operations['registerUser'];
  };
  '/api/v1/auth/login': {
    post: operations['loginUser'];
  };
  '/api/v1/public/categories': {
    get: operations['listCategories'];
  };
  '/api/v1/public/products': {
    get: operations['listProducts'];
  };
  '/api/v1/public/products/{slug}': {
    get: operations['getProductBySlug'];
  };
  '/api/v1/public/cart': {
    post: operations['createCart'];
  };
  '/api/v1/public/cart/{cartId}': {
    get: operations['getCart'];
  };
  '/api/v1/public/cart/{cartId}/items': {
    post: operations['addCartItem'];
  };
  '/api/v1/public/cart/{cartId}/items/{itemId}': {
    put: operations['updateCartItem'];
    delete: operations['removeCartItem'];
  };
  '/api/v1/checkout/create-order': {
    post: operations['createOrder'];
  };
  '/api/v1/admin/categories': {
    get: operations['adminListCategories'];
    post: operations['adminCreateCategory'];
  };
  '/api/v1/admin/categories/{id}': {
    put: operations['adminUpdateCategory'];
    delete: operations['adminDeleteCategory'];
  };
  '/api/v1/admin/products': {
    get: operations['adminListProducts'];
    post: operations['adminCreateProduct'];
  };
  '/api/v1/admin/products/{id}': {
    put: operations['adminUpdateProduct'];
    delete: operations['adminDeleteProduct'];
  };
  '/api/v1/admin/orders': {
    get: operations['adminListOrders'];
  };
  '/api/v1/admin/orders/{externalId}': {
    get: operations['adminGetOrder'];
  };
  '/api/v1/admin/orders/{externalId}/status': {
    put: operations['adminUpdateOrderStatus'];
  };
  '/api/v1/admin/customers': {
    get: operations['adminListCustomers'];
  };
  '/api/v1/admin/customers/{id}': {
    get: operations['adminGetCustomer'];
  };
  '/api/v1/admin/customers/{id}/enable': {
    put: operations['adminEnableCustomer'];
  };
  '/api/v1/admin/customers/{id}/disable': {
    put: operations['adminDisableCustomer'];
  };
}

export interface webhooks {
  [key: string]: never;
}

export interface components {
  schemas: {
    RegisterRequest: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    AuthResponse: {
      token: string;
      user: components['schemas']['UserDto'];
    };
    UserDto: {
      id: string;
      email: string;
      role: 'ADMIN' | 'CUSTOMER';
    };
    ApiErrorResponse: {
      message: string;
      status: number;
      code?: string;
    };
    CategoryDto: {
      id: string;
      name: string;
      slug: string;
    };
    ProductDto: {
      id: string;
      name: string;
      slug: string;
      description: string;
      price: number;
      stock: number;
      imageUrl?: string;
      category: components['schemas']['CategoryDto'];
    };
    CartDto: {
      id: string;
      sessionId: string;
      items: components['schemas']['CartItemDto'][];
      total: number;
    };
    CartItemDto: {
      id: string;
      product: components['schemas']['ProductDto'];
      quantity: number;
      unitPrice: number;
    };
    CreateOrderRequest: {
      cartId: string;
      shippingAddress: components['schemas']['AddressDto'];
    };
    AddressDto: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    OrderDto: {
      externalId: string;
      status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
      total: number;
      items: components['schemas']['CartItemDto'][];
      shippingAddress: components['schemas']['AddressDto'];
      createdAt: string;
    };
    PaginatedResponse: {
      items: unknown[];
      total: number;
      page: number;
      pageSize: number;
    };
  };
}

export type $defs = Record<string, never>;

export interface operations {
  registerUser: {
    requestBody: {
      content: {
        'application/json': components['schemas']['RegisterRequest'];
      };
    };
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['AuthResponse'];
        };
      };
      400: {
        content: {
          'application/json': components['schemas']['ApiErrorResponse'];
        };
      };
    };
  };
  loginUser: {
    requestBody: {
      content: {
        'application/json': components['schemas']['LoginRequest'];
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['AuthResponse'];
        };
      };
      401: {
        content: {
          'application/json': components['schemas']['ApiErrorResponse'];
        };
      };
    };
  };
  listCategories: {
    parameters: {
      query?: {
        page?: number;
        pageSize?: number;
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CategoryDto'][];
        };
      };
    };
  };
  listProducts: {
    parameters: {
      query?: {
        categorySlug?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        pageSize?: number;
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['PaginatedResponse'];
        };
      };
    };
  };
  getProductBySlug: {
    parameters: {
      path: { slug: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['ProductDto'];
        };
      };
    };
  };
  createCart: {
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['CartDto'];
        };
      };
    };
  };
  getCart: {
    parameters: {
      path: { cartId: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CartDto'];
        };
      };
    };
  };
  addCartItem: {
    parameters: {
      path: { cartId: string };
    };
    requestBody: {
      content: {
        'application/json': {
          productId: string;
          quantity: number;
        };
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CartDto'];
        };
      };
    };
  };
  updateCartItem: {
    parameters: {
      path: { cartId: string; itemId: string };
    };
    requestBody: {
      content: {
        'application/json': {
          quantity: number;
        };
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CartDto'];
        };
      };
    };
  };
  removeCartItem: {
    parameters: {
      path: { cartId: string; itemId: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CartDto'];
        };
      };
    };
  };
  createOrder: {
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateOrderRequest'];
      };
    };
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['OrderDto'];
        };
      };
    };
  };
  adminListCategories: {
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CategoryDto'][];
        };
      };
    };
  };
  adminCreateCategory: {
    requestBody: {
      content: {
        'application/json': Omit<components['schemas']['CategoryDto'], 'id'>;
      };
    };
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['CategoryDto'];
        };
      };
    };
  };
  adminUpdateCategory: {
    parameters: {
      path: { id: string };
    };
    requestBody: {
      content: {
        'application/json': Partial<Omit<components['schemas']['CategoryDto'], 'id'>>;
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['CategoryDto'];
        };
      };
    };
  };
  adminDeleteCategory: {
    parameters: {
      path: { id: string };
    };
    responses: {
      204: { content: never };
    };
  };
  adminListProducts: {
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['PaginatedResponse'];
        };
      };
    };
  };
  adminCreateProduct: {
    requestBody: {
      content: {
        'application/json': Omit<components['schemas']['ProductDto'], 'id' | 'category'> & {
          categoryId: string;
        };
      };
    };
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['ProductDto'];
        };
      };
    };
  };
  adminUpdateProduct: {
    parameters: {
      path: { id: string };
    };
    requestBody: {
      content: {
        'application/json': Partial<
          Omit<components['schemas']['ProductDto'], 'id' | 'category'> & {
            categoryId: string;
          }
        >;
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['ProductDto'];
        };
      };
    };
  };
  adminDeleteProduct: {
    parameters: {
      path: { id: string };
    };
    responses: {
      204: { content: never };
    };
  };
  adminListOrders: {
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['PaginatedResponse'];
        };
      };
    };
  };
  adminGetOrder: {
    parameters: {
      path: { externalId: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['OrderDto'];
        };
      };
    };
  };
  adminUpdateOrderStatus: {
    parameters: {
      path: { externalId: string };
    };
    requestBody: {
      content: {
        'application/json': {
          status: components['schemas']['OrderDto']['status'];
        };
      };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['OrderDto'];
        };
      };
    };
  };
  adminListCustomers: {
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['PaginatedResponse'];
        };
      };
    };
  };
  adminGetCustomer: {
    parameters: {
      path: { id: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['UserDto'];
        };
      };
    };
  };
  adminEnableCustomer: {
    parameters: {
      path: { id: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['UserDto'];
        };
      };
    };
  };
  adminDisableCustomer: {
    parameters: {
      path: { id: string };
    };
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['UserDto'];
        };
      };
    };
  };
}
