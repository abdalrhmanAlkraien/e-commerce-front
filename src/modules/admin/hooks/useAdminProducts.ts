import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminApi,
  type AdminCreateProductRequest,
  type AdminUpdateProductRequest,
} from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const adminProductKeys = {
  all: ['admin', 'products'] as const,
};

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
