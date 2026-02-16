import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminApi,
  type AdminCreateProductRequest,
  type AdminUpdateProductRequest,
  type AdminListProductsParams,
} from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const adminProductKeys = {
  all: ['admin', 'products'] as const,
  list: (params?: AdminListProductsParams) =>
    [...adminProductKeys.all, 'list', params] as const,
};

/** Lists products in the admin panel. Requires ADMIN role. */
export function useAdminListProducts(params?: AdminListProductsParams) {
  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn: () => adminApi.listProducts(params),
    staleTime: 30_000,
  });
}

/** Creates a new product. Requires ADMIN role. */
export function useAdminCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCreateProductRequest) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      toast.success('Product created successfully.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}

/** Updates an existing product (supports partial update, including stock). Requires ADMIN role. */
export function useAdminUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateProductRequest }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      toast.success('Product updated successfully.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}

/** Deletes a product. Requires ADMIN role. */
export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      toast.success('Product deleted.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
