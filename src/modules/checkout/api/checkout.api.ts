import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

export type OrderDto = components['schemas']['OrderDto'];
export type AddressDto = components['schemas']['AddressDto'];
export type CreateOrderRequest = components['schemas']['CreateOrderRequest'];

export const checkoutApi = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderDto> => {
    const response = await axiosClient.post<OrderDto>('/api/v1/checkout/create-order', data);
    return response.data;
  },
};
