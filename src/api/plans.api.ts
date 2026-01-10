import apiClient from './client';

// Plan limits structure (matches backend)
export interface PlanLimits {
  maxTables: number;
  maxMenuItems: number;
  maxAdmins: number;
  maxOrders: number;
}

export interface Plan {
  _id: string; // Changed from 'id' to '_id' to match MongoDB backend
  name: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[]; // Backend returns string array, not PlanFeature objects
  limits: PlanLimits; // Limits are nested in backend
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  plans: Plan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreatePlanRequest {
  name: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  description: string;
  price: number;
  currency?: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[]; // Backend expects string array
  limits: PlanLimits; // Backend expects nested limits object
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdatePlanRequest {
  name?: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  description?: string;
  price?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly';
  features?: string[]; // Backend expects string array
  limits?: PlanLimits; // Backend expects nested limits object
  isActive?: boolean;
  displayOrder?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const plansApi = {
  getAll: async (): Promise<PlansResponse> => {
    const response = await apiClient.get<ApiResponse<PlansResponse>>('/api/superadmin/plans');
    return response.data.data;
  },

  seed: async (): Promise<{ message: string; plans: Plan[] }> => {
    const response = await apiClient.post<ApiResponse<{ message: string; plans: Plan[] }>>('/api/superadmin/plans/seed');
    return response.data.data;
  },

  create: async (data: CreatePlanRequest): Promise<Plan> => {
    const response = await apiClient.post<ApiResponse<Plan>>('/api/superadmin/plans', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePlanRequest): Promise<Plan> => {
    const response = await apiClient.put<ApiResponse<Plan>>(`/api/superadmin/plans/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/api/superadmin/plans/${id}`);
  },
};

export default plansApi;
