import apiClient from './client';

export interface DashboardStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalAdmins: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  pendingTickets: number;
  growthRate: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RecentActivity {
  activities: ActivityItem[];
  total: number;
}

const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/superadmin/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (): Promise<RecentActivity> => {
    const response = await apiClient.get<RecentActivity>('/api/superadmin/dashboard/activity');
    return response.data;
  },
};

export default dashboardApi;
