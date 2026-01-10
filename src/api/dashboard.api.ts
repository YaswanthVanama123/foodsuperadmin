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

export interface DashboardPageData {
  stats: PlatformStats;
  recentActivity: RecentActivity;
}

const dashboardApi = {
  /**
   * Get dashboard page data (stats + recent activity) - OPTIMIZED (SINGLE REQUEST)
   */
  getPageData: async (limit: number = 10): Promise<DashboardPageData> => {
    const response = await apiClient.get<{ success: boolean; data: DashboardPageData }>(
      `/api/superadmin/analytics/dashboard/page-data?limit=${limit}`
    );
    return response.data.data;
  },

  /**
   * Get platform statistics (legacy - use getPageData instead)
   */
  getStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get<{ success: boolean; data: PlatformStats }>(
      '/api/superadmin/analytics/stats'
    );
    return response.data.data;
  },

  /**
   * Get recent activity from audit logs (legacy - use getPageData instead)
   */
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity> => {
    const response = await apiClient.get<{ success: boolean; data: RecentActivity }>(
      `/api/superadmin/audit-logs?limit=${limit}`
    );
    return response.data.data;
  },
};

export default dashboardApi;
