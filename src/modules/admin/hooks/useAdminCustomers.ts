import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi, type AdminListCustomersParams } from '../api/admin.api';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const adminCustomerKeys = {
  all: ['admin', 'customers'] as const,
  list: (params?: AdminListCustomersParams) =>
    [...adminCustomerKeys.all, 'list', params] as const,
  detail: (id: string) => ['admin', 'customers', id] as const,
};

/** Lists all customers. Requires ADMIN role. */
export function useAdminListCustomers(params?: AdminListCustomersParams) {
  return useQuery({
    queryKey: adminCustomerKeys.list(params),
    queryFn: () => adminApi.listCustomers(params),
    staleTime: 30_000,
  });
}

/** Fetches a single customer by id. Requires ADMIN role. */
export function useAdminCustomerDetails(id: string) {
  return useQuery({
    queryKey: adminCustomerKeys.detail(id),
    queryFn: () => adminApi.getCustomer(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

/** Enables a customer account. Requires ADMIN role. */
export function useAdminEnableCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.enableCustomer(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: adminCustomerKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCustomerKeys.detail(id) });
      toast.success('Customer account enabled.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}

/** Disables a customer account. Requires ADMIN role. */
export function useAdminDisableCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.disableCustomer(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: adminCustomerKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCustomerKeys.detail(id) });
      toast.success('Customer account disabled.');
    },
    onError: (err) => {
      toast.error(mapApiErrorToMessage(err));
    },
  });
}
