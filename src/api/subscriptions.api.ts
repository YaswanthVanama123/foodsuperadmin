import apiClient from './client';

export interface Subscription {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  planId: string;
  planName?: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
}

export interface CreateSubscriptionRequest {
  restaurantId: string;
  planId: string;
  startDate: string;
  billingCycle: 'monthly' | 'yearly';
  autoRenew?: boolean;
}

export interface UpdateSubscriptionRequest {
  planId?: string;
  endDate?: string;
  billingCycle?: 'monthly' | 'yearly';
  autoRenew?: boolean;
  amount?: number;
  status?: 'active' | 'cancelled' | 'expired' | 'pending';
}

export interface RenewSubscriptionRequest {
  amount?: number;
  billingCycle?: 'monthly' | 'yearly';
  extensionMonths?: number;
  paymentRecord?: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
  };
}

const subscriptionsApi = {
  getAll: async (): Promise<SubscriptionsResponse> => {
    const response = await apiClient.get<SubscriptionsResponse>('/api/superadmin/subscriptions');
    return response.data;
  },

  getByRestaurant: async (restaurantId: string): Promise<SubscriptionsResponse> => {
    const response = await apiClient.get<SubscriptionsResponse>(
      `/api/superadmin/subscriptions/restaurant/${restaurantId}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/api/superadmin/subscriptions/${id}`);
    return response.data;
  },

  create: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/api/superadmin/subscriptions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.put<Subscription>(`/api/superadmin/subscriptions/${id}`, data);
    return response.data;
  },

  cancel: async (id: string, reason?: string): Promise<Subscription> => {
    const response = await apiClient.patch<Subscription>(
      `/api/superadmin/subscriptions/${id}/cancel`,
      { cancellationReason: reason }
    );
    return response.data;
  },

  renew: async (id: string, data?: RenewSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>(
      `/api/superadmin/subscriptions/${id}/renew`,
      data || {}
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/superadmin/subscriptions/${id}`);
  },
};

export default subscriptionsApi;
