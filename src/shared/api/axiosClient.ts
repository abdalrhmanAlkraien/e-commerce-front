import axios from 'axios';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { env } from '@/shared/config/env';
import { ApiErrorInstance } from './apiError';
import { useAuthStore } from '@/modules/auth/store/authStore';

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; code?: string }>;
      const status = axiosError.response?.status ?? 0;
      const message =
        axiosError.response?.data?.message ?? axiosError.message ?? 'An error occurred.';
      const code = axiosError.response?.data?.code;

      if (status === 401) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
      }

      return Promise.reject(new ApiErrorInstance({ message, status, code }));
    }

    return Promise.reject(
      new ApiErrorInstance({
        message: 'Network error. Please try again.',
        status: 0,
      }),
    );
  },
);
