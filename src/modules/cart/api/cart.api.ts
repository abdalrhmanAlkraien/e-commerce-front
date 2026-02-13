import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

export type CartDto = components['schemas']['CartDto'];
export type CartItemDto = components['schemas']['CartItemDto'];

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  create: async (): Promise<CartDto> => {
    const response = await axiosClient.post<CartDto>('/api/v1/public/cart');
    return response.data;
  },

  get: async (cartId: string, sessionId: string): Promise<CartDto> => {
    const response = await axiosClient.get<CartDto>(`/api/v1/public/cart/${cartId}`, {
      headers: { 'X-SESSION-ID': sessionId },
    });
    return response.data;
  },

  addItem: async (
    cartId: string,
    sessionId: string,
    data: AddCartItemRequest,
  ): Promise<CartDto> => {
    const response = await axiosClient.post<CartDto>(
      `/api/v1/public/cart/${cartId}/items`,
      data,
      { headers: { 'X-SESSION-ID': sessionId } },
    );
    return response.data;
  },

  updateItem: async (
    cartId: string,
    itemId: string,
    sessionId: string,
    data: UpdateCartItemRequest,
  ): Promise<CartDto> => {
    const response = await axiosClient.put<CartDto>(
      `/api/v1/public/cart/${cartId}/items/${itemId}`,
      data,
      { headers: { 'X-SESSION-ID': sessionId } },
    );
    return response.data;
  },

  removeItem: async (cartId: string, itemId: string, sessionId: string): Promise<CartDto> => {
    const response = await axiosClient.delete<CartDto>(
      `/api/v1/public/cart/${cartId}/items/${itemId}`,
      { headers: { 'X-SESSION-ID': sessionId } },
    );
    return response.data;
  },
};
