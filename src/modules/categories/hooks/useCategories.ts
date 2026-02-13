import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import type { ListCategoriesParams } from '../api/categories.api';

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: ListCategoriesParams) => [...categoryKeys.all, 'list', params] as const,
};

/**
 * useCategories — fetches the full category list.
 * Aggressively cached (5 minutes staleTime) — categories change rarely.
 */
export function useCategories(params?: ListCategoriesParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
