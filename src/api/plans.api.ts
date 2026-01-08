import apiClient from './client';

export interface PlanFeature {
  name: string;
  value: string | number | boolean;
  description?: string;
}

export interface Plan {
  id: string;
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

const plansApi = {
  getAll: async (): Promise<PlansResponse> => {
    const response = await apiClient.get<PlansResponse>('/api/superadmin/plans');
    return response.data;
  },

  create: async (data: CreatePlanRequest): Promise<Plan> => {
    const response = await apiClient.post<Plan>('/api/superadmin/plans', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePlanRequest): Promise<Plan> => {
    const response = await apiClient.put<Plan>(`/api/superadmin/plans/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/superadmin/plans/${id}`);
  },
};

export default plansApi;
