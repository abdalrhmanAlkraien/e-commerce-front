import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

// ── Re-exported DTO types ─────────────────────────────────────────────────────

export type ProductDto = components['schemas']['ProductDto'];
export type OrderDto = components['schemas']['OrderDto'];
export type CategoryDto = components['schemas']['CategoryDto'];
export type UserDto = components['schemas']['UserDto'];

// ── Extended types not present in bootstrap stub ──────────────────────────────

export type AdminCustomerDto = UserDto & { enabled: boolean; createdAt?: string };

// ── Admin category request types ──────────────────────────────────────────────

export type AdminCreateCategoryRequest = Omit<CategoryDto, 'id'>;
export type AdminUpdateCategoryRequest = Partial<AdminCreateCategoryRequest>;

// ── Admin product request types ───────────────────────────────────────────────

export type AdminCreateProductRequest = Omit<ProductDto, 'id' | 'category'> & {
  categoryId: string;
};

export type AdminUpdateProductRequest = Partial<AdminCreateProductRequest>;

// ── Admin order request types ─────────────────────────────────────────────────

export type AdminUpdateOrderStatusRequest = {
  status: OrderDto['status'];
};

// ── Paginated response shapes ─────────────────────────────────────────────────

export interface PaginatedAdminProducts {
  items: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedOrders {
  items: OrderDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedCustomers {
  items: AdminCustomerDto[];
  total: number;
  page: number;
  pageSize: number;
}

// ── List param shapes ─────────────────────────────────────────────────────────

export interface AdminListProductsParams {
  search?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminListOrdersParams {
  status?: OrderDto['status'];
  page?: number;
  pageSize?: number;
}

export interface AdminListCustomersParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  // ── Categories ──────────────────────────────────────────────────────────────

  listCategories: async (): Promise<CategoryDto[]> => {
    const response = await axiosClient.get<CategoryDto[]>('/api/v1/admin/categories');
    return response.data;
  },

  createCategory: async (data: AdminCreateCategoryRequest): Promise<CategoryDto> => {
    const response = await axiosClient.post<CategoryDto>('/api/v1/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: AdminUpdateCategoryRequest): Promise<CategoryDto> => {
    const response = await axiosClient.put<CategoryDto>(`/api/v1/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/v1/admin/categories/${id}`);
  },

  // ── Products ─────────────────────────────────────────────────────────────────

  listProducts: async (params?: AdminListProductsParams): Promise<PaginatedAdminProducts> => {
    const response = await axiosClient.get<PaginatedAdminProducts>('/api/v1/admin/products', {
      params,
    });
    return response.data;
  },

  createProduct: async (data: AdminCreateProductRequest): Promise<ProductDto> => {
    const response = await axiosClient.post<ProductDto>('/api/v1/admin/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: AdminUpdateProductRequest): Promise<ProductDto> => {
    const response = await axiosClient.put<ProductDto>(`/api/v1/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/v1/admin/products/${id}`);
  },

  // ── Orders ───────────────────────────────────────────────────────────────────

  listOrders: async (params?: AdminListOrdersParams): Promise<PaginatedOrders> => {
    const response = await axiosClient.get<PaginatedOrders>('/api/v1/admin/orders', { params });
    return response.data;
  },

  getOrder: async (externalId: string): Promise<OrderDto> => {
    const response = await axiosClient.get<OrderDto>(`/api/v1/admin/orders/${externalId}`);
    return response.data;
  },

  updateOrderStatus: async (
    externalId: string,
    data: AdminUpdateOrderStatusRequest,
  ): Promise<OrderDto> => {
    const response = await axiosClient.put<OrderDto>(
      `/api/v1/admin/orders/${externalId}/status`,
      data,
    );
    return response.data;
  },

  refundOrder: async (externalId: string): Promise<OrderDto> => {
    const response = await axiosClient.post<OrderDto>(
      `/api/v1/admin/orders/${externalId}/refund`,
    );
    return response.data;
  },

  // ── Customers ────────────────────────────────────────────────────────────────

  listCustomers: async (params?: AdminListCustomersParams): Promise<PaginatedCustomers> => {
    const response = await axiosClient.get<PaginatedCustomers>('/api/v1/admin/customers', {
      params,
    });
    return response.data;
  },

  getCustomer: async (id: string): Promise<AdminCustomerDto> => {
    const response = await axiosClient.get<AdminCustomerDto>(`/api/v1/admin/customers/${id}`);
    return response.data;
  },

  enableCustomer: async (id: string): Promise<AdminCustomerDto> => {
    const response = await axiosClient.put<AdminCustomerDto>(
      `/api/v1/admin/customers/${id}/enable`,
    );
    return response.data;
  },

  disableCustomer: async (id: string): Promise<AdminCustomerDto> => {
    const response = await axiosClient.put<AdminCustomerDto>(
      `/api/v1/admin/customers/${id}/disable`,
    );
    return response.data;
  },
};
