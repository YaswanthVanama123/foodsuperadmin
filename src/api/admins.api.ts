import apiClient from './client';

export interface Admin {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  restaurantId: string;
  restaurantName?: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AdminsResponse {
  admins: Admin[];
  total: number;
}

export interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  restaurantId: string;
  role: string;
}

export interface UpdateAdminRequest {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

const adminsApi = {
  getAll: async (restaurantId?: string): Promise<AdminsResponse> => {
    const params = new URLSearchParams();
    if (restaurantId) params.append('restaurantId', restaurantId);

    const response = await apiClient.get<AdminsResponse>(
      `/api/superadmin/admins?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Admin> => {
    const response = await apiClient.get<Admin>(`/api/superadmin/admins/${id}`);
    return response.data;
  },

  create: async (data: CreateAdminRequest): Promise<Admin> => {
    const response = await apiClient.post<Admin>('/api/superadmin/admins', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
    const response = await apiClient.put<Admin>(`/api/superadmin/admins/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/superadmin/admins/${id}`);
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.post(`/api/superadmin/admins/${id}/reset-password`, { newPassword });
  },

  getActivity: async (id: string): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ActivityLog[]>(`/api/superadmin/admins/${id}/activity`);
    return response.data;
  },
};

export default adminsApi;
