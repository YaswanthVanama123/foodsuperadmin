import apiClient from './client';

export interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionStatus?: string;
  currentPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateRestaurantRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UpdateStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
}

const restaurantsApi = {
  getAll: async (page?: number, limit?: number, search?: string): Promise<RestaurantsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const response = await apiClient.get<RestaurantsResponse>(
      `/api/superadmin/restaurants?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Restaurant> => {
    const response = await apiClient.get<Restaurant>(`/api/superadmin/restaurants/${id}`);
    return response.data;
  },

  create: async (data: CreateRestaurantRequest): Promise<Restaurant> => {
    const response = await apiClient.post<Restaurant>('/api/superadmin/restaurants', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRestaurantRequest): Promise<Restaurant> => {
    const response = await apiClient.put<Restaurant>(`/api/superadmin/restaurants/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/superadmin/restaurants/${id}`);
  },

  updateStatus: async (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<Restaurant> => {
    const response = await apiClient.patch<Restaurant>(
      `/api/superadmin/restaurants/${id}/status`,
      { status }
    );
    return response.data;
  },
};

export default restaurantsApi;
