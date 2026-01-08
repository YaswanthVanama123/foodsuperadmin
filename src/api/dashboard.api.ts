import apiClient from './client';
import { PlatformStats } from '../types';

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
  // Get platform statistics (same as analytics stats)
  getStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get<{ success: boolean; data: PlatformStats }>(
      '/api/superadmin/analytics/stats'
    );
    return response.data.data;
  },

  // Get recent activity from audit logs
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity> => {
    const response = await apiClient.get<{ success: boolean; data: RecentActivity }>(
      `/api/superadmin/audit-logs?limit=${limit}`
    );
    return response.data.data;
  },
};

export default dashboardApi;
