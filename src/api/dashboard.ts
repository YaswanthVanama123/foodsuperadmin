import { apiClient } from './client';
import { PlatformStats, RecentActivity, ApiResponse } from '../types';

export const dashboardApi = {
  /**
   * Get platform dashboard statistics
   */
  getStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get<ApiResponse<PlatformStats>>('/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get recent activity for dashboard
   */
  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await apiClient.get<ApiResponse<RecentActivity[]>>(`/dashboard/recent-activity?limit=${limit}`);
    return response.data.data;
  },
};
