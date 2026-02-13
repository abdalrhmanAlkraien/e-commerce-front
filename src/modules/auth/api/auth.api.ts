import { axiosClient } from '@/shared/api/axiosClient';
import type { components } from '@/shared/types/api';

export type LoginRequest = components['schemas']['LoginRequest'];
export type RegisterRequest = components['schemas']['RegisterRequest'];
export type AuthResponse = components['schemas']['AuthResponse'];

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  },
};
