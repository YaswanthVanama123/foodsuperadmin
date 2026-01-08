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
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/superadmin/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/superadmin/auth/logout');
  },

  getCurrentSuperAdmin: async (): Promise<SuperAdmin> => {
    const response = await apiClient.get<SuperAdmin>('/api/superadmin/auth/me');
    return response.data;
  },
};

export default authApi;
