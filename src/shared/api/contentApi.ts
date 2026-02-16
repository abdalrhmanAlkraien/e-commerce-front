import { axiosClient } from './axiosClient';

export interface ContentUploadResponse {
  id: string;
  url: string;
}

export const contentApi = {
  /**
   * Upload a file using multipart/form-data.
   * POST /api/v1/content/upload
   * Agent MUST use FormData. Never send JSON.
   */
  upload: async (file: File): Promise<ContentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ContentUploadResponse>(
      '/api/v1/content/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },
};
