import { apiClient } from './client';
import { SuperAdmin, ApiResponse, LoginFormData } from '../types';

interface LoginResponse {
  superAdmin: SuperAdmin;
  token: string;
}

export const authApi = {
  /**
   * Login super admin
   */
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Logout super admin
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current super admin profile
   */
  getProfile: async (): Promise<SuperAdmin> => {
    const response = await apiClient.get<ApiResponse<SuperAdmin>>('/auth/profile');
    return response.data.data;
  },
};
