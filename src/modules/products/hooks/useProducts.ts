import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import type { ListProductsParams, ProductDto } from '../api/products.api';

export const productKeys = {
  all: ['products'] as const,
  list: (params?: ListProductsParams) => [...productKeys.all, 'list', params] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};

export function useProducts(params?: ListProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
    staleTime: 60_000,
  });
}

export function useProductDetails(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsApi.getBySlug(slug),
    staleTime: 60_000,
    enabled: Boolean(slug),
  });
}

/**
 * Returns a prefetch function for use on ProductCard hover.
 * Dramatically improves perceived navigation speed.
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (product: ProductDto) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(product.slug),
      queryFn: () => productsApi.getBySlug(product.slug),
      staleTime: 60_000,
    });
  };
}
