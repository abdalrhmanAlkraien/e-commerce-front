import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

export type ProductDto = components['schemas']['ProductDto'];

export interface PaginatedProducts {
  items: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListProductsParams {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export const productsApi = {
  list: async (params?: ListProductsParams): Promise<PaginatedProducts> => {
    const response = await axiosClient.get<PaginatedProducts>('/api/v1/public/products', {
      params,
    });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<ProductDto> => {
    const response = await axiosClient.get<ProductDto>(`/api/v1/public/products/${slug}`);
    return response.data;
  },
};
