import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mapApiErrorToMessage } from '@/shared/utils/errorMapper';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error: unknown) => {
        const message = mapApiErrorToMessage(error);
        toast.error(message);
      },
    },
  },
});
