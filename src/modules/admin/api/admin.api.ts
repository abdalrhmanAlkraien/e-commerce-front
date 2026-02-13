import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

// ── Re-exported DTO types ─────────────────────────────────────────────────────

export type ProductDto = components['schemas']['ProductDto'];
export type OrderDto = components['schemas']['OrderDto'];
export type CategoryDto = components['schemas']['CategoryDto'];

// ── Admin product request types ───────────────────────────────────────────────

export type AdminCreateProductRequest = Omit<ProductDto, 'id' | 'category'> & {
  categoryId: string;
};

export type AdminUpdateProductRequest = Partial<AdminCreateProductRequest>;

// ── Admin order request types ─────────────────────────────────────────────────

export type AdminUpdateOrderStatusRequest = {
  status: OrderDto['status'];
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  // Products

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

  // Orders

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
};
