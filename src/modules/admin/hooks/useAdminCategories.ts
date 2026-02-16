import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminApi,
  type AdminCreateCategoryRequest,
  type AdminUpdateCategoryRequest,
} from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';
import { isApiError } from '@/shared/api/apiError';

export const adminCategoryKeys = {
  all: ['admin', 'categories'] as const,
  list: () => [...adminCategoryKeys.all, 'list'] as const,
};

export function useAdminListCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.list(),
    queryFn: adminApi.listCategories,
    staleTime: 60_000,
  });
}

export function useAdminCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCreateCategoryRequest) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      toast.success('Category created.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}

export function useAdminUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateCategoryRequest }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      toast.success('Category updated.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}

export function useAdminDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoryKeys.all });
      toast.success('Category deleted.');
    },
    onError: (err) => {
      // Surface 409 conflict (category has products) explicitly
      if (isApiError(err) && err.status === 409) {
        toast.error('Cannot delete: category still has products assigned to it.');
      } else {
        toast.error(mapApiErrorToMessage(err));
      }
    },
  });
}
