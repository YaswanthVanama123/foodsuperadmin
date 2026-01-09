import apiClient from './client';

export interface PlanFeature {
  name: string;
  value: string | number | boolean;
  description?: string;
}

export interface Plan {
  _id: string; // Changed from 'id' to '_id' to match MongoDB backend
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  maxTables?: number;
  maxMenuItems?: number;
  maxStaff?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  plans: Plan[];
  total: number;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  maxTables?: number;
  maxMenuItems?: number;
  maxStaff?: number;
  isActive?: boolean;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  billingCycle?: 'monthly' | 'yearly';
  features?: PlanFeature[];
  maxTables?: number;
  maxMenuItems?: number;
  maxStaff?: number;
  isActive?: boolean;
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
