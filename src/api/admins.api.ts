import apiClient from './client';

export interface Admin {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  restaurantId: {
    _id: string;
    name: string;
    subdomain: string;
  } | string;
  role: 'admin' | 'manager' | 'staff';
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminsResponse {
  admins: Admin[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  restaurantId: string;
  role?: 'admin' | 'manager' | 'staff';
  permissions?: string[];
}

export interface UpdateAdminRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'staff';
  permissions?: string[];
  isActive?: boolean;
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

export interface AdminsPageDataResponse {
  admins: Admin[];
  restaurants: Array<{
    _id: string;
    name: string;
    subdomain: string;
  }>;
}

const adminsApi = {
  // Get admins page data (admins + restaurants) - OPTIMIZED
  getPageData: async (limit: number = 1000): Promise<AdminsPageDataResponse> => {
    const response = await apiClient.get<{ success: boolean; data: AdminsPageDataResponse }>(
      `/api/super-admin/admins/page-data?limit=${limit}`
    );
    return response.data.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    restaurantId?: string;
    role?: string;
    status?: string;
  }): Promise<AdminsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.restaurantId) queryParams.append('restaurantId', params.restaurantId);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiClient.get<{ success: boolean; data: AdminsResponse }>(
      `/api/super-admin/admins?${queryParams.toString()}`
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Admin> => {
    const response = await apiClient.get<{ success: boolean; data: Admin }>(
      `/api/super-admin/admins/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateAdminRequest): Promise<Admin> => {
    const response = await apiClient.post<{ success: boolean; data: Admin; message: string }>(
      '/api/super-admin/admins',
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
    const response = await apiClient.put<{ success: boolean; data: Admin; message: string }>(
      `/api/super-admin/admins/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean; message: string }>(
      `/api/super-admin/admins/${id}`
    );
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<Admin> => {
    const response = await apiClient.patch<{ success: boolean; data: Admin; message: string }>(
      `/api/super-admin/admins/${id}/status`,
      { isActive }
    );
    return response.data.data;
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.post<{ success: boolean; message: string }>(
      `/api/super-admin/admins/${id}/reset-password`,
      { newPassword }
    );
  },

  // Note: getActivity endpoint not implemented in backend yet
  getActivity: async (id: string): Promise<ActivityLog[]> => {
    // This endpoint doesn't exist in backend - return empty array for now
    console.warn(`Admin activity endpoint not implemented yet for admin ${id}`);
    return [];
  },
};

export default adminsApi;
