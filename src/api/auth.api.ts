import apiClient from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  superAdmin: SuperAdmin;
}

export interface SuperAdmin {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>('/api/super-admin/auth/login', {
      username,
      password,
    });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/super-admin/auth/logout');
  },

  getCurrentSuperAdmin: async (): Promise<SuperAdmin> => {
    const response = await apiClient.get<{ success: boolean; data: SuperAdmin }>('/api/super-admin/auth/me');
    return response.data.data;
  },
};

export default authApi;
