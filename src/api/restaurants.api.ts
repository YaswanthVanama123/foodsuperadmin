import apiClient from './client';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Branding {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  theme: string;
}

export interface Settings {
  currency: string;
  taxRate: number;
  serviceChargeRate: number;
  timezone: string;
  locale: string;
  orderNumberPrefix: string;
}

export interface Subscription {
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'yearly';
  maxTables: number;
  maxMenuItems: number;
  maxAdmins: number;
}

export interface Restaurant {
  _id: string;
  subdomain: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: Address;
  branding: Branding;
  settings: Settings;
  subscription: Subscription;
  isActive: boolean;
  isOnboarded: boolean;
  onboardingStep: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    adminCount: number;
    orderCount: number;
    menuItemCount: number;
    categoryCount?: number;
    tableCount?: number;
    totalRevenue?: number;
    averageOrderValue?: number;
  };
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateRestaurantRequest {
  subdomain: string;
  name: string;
  email: string;
  phone?: string;
  address?: Partial<Address>;
  branding?: Partial<Branding>;
  settings?: Partial<Settings>;
  subscription?: Partial<Subscription>;
}

export interface UpdateRestaurantRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: Partial<Address>;
  branding?: Partial<Branding>;
  settings?: Partial<Settings>;
  subscription?: Partial<Subscription>;
  isActive?: boolean;
  onboardingStep?: number;
}

export interface UpdateStatusRequest {
  status: 'active' | 'inactive' | 'suspended';
}

const restaurantsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    subscriptionStatus?: string;
    plan?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<RestaurantsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.subscriptionStatus) queryParams.append('subscriptionStatus', params.subscriptionStatus);
    if (params?.plan) queryParams.append('plan', params.plan);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<{ success: boolean; data: RestaurantsResponse }>(
      `/api/super-admin/restaurants?${queryParams.toString()}`
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<{ restaurant: Restaurant; stats: any; recentOrders: any[]; admins: any[] }> => {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `/api/super-admin/restaurants/${id}`
    );
    return response.data.data;
  },

  create: async (data: CreateRestaurantRequest): Promise<Restaurant> => {
    const response = await apiClient.post<{ success: boolean; data: Restaurant; message: string }>(
      '/api/super-admin/restaurants',
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateRestaurantRequest): Promise<Restaurant> => {
    const response = await apiClient.put<{ success: boolean; data: Restaurant; message: string }>(
      `/api/super-admin/restaurants/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean; message: string }>(
      `/api/super-admin/restaurants/${id}`
    );
  },

  updateStatus: async (id: string, status: 'active' | 'inactive' | 'suspended'): Promise<Restaurant> => {
    const response = await apiClient.patch<{ success: boolean; data: Restaurant; message: string }>(
      `/api/super-admin/restaurants/${id}/status`,
      { status }
    );
    return response.data.data;
  },
};

export default restaurantsApi;
