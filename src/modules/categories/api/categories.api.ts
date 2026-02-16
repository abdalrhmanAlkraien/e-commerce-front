import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

export type CategoryDto = components['schemas']['CategoryDto'];

export interface ListCategoriesParams {
  page?: number;
  pageSize?: number;
}

export const categoriesApi = {
  list: async (params?: ListCategoriesParams): Promise<CategoryDto[]> => {
    const response = await axiosClient.get<CategoryDto[]>('/api/v1/public/categories', {
      params,
    });
    return response.data;
  },
};
