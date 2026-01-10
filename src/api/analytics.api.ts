import apiClient from './client';

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  subscriptions: number;
}

export interface PlatformRevenueResponse {
  totalRevenue: number;
  periodRevenue: number;
  growthRate: number;
  data: RevenueDataPoint[];
}

export interface GrowthDataPoint {
  month: string;
  newRestaurants: number;
  activeRestaurants: number;
  churnedRestaurants: number;
}

export interface RestaurantGrowthResponse {
  totalGrowth: number;
  monthlyGrowth: number;
  data: GrowthDataPoint[];
}

export interface TopRestaurant {
  id: string;
  name: string;
  revenue: number;
  subscriptionPlan: string;
  activeUsers: number;
  ordersCount: number;
}

export interface TopRestaurantsResponse {
  restaurants: TopRestaurant[];
  total: number;
}

export interface PlatformStats {
  restaurants: {
    total: number;
    active: number;
  };
  revenue: {
    totalRevenue: number;
  };
  users: {
    totalCustomers: number;
  };
  orders: {
    total: number;
  };
}

export interface AnalyticsPageDataResponse {
  revenue: PlatformRevenueResponse;
  growth: RestaurantGrowthResponse;
  topRestaurants: TopRestaurantsResponse;
  stats: PlatformStats;
}

interface ApiResponse<T> {
  data: T;
}

const analyticsApi = {
  getPageData: async (startDate?: string, endDate?: string): Promise<AnalyticsPageDataResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `/api/superadmin/analytics/page-data${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ApiResponse<AnalyticsPageDataResponse>>(url);
    return response.data.data;
  },

  getPlatformRevenue: async (startDate: string, endDate: string): Promise<PlatformRevenueResponse> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<PlatformRevenueResponse>>(
      `/api/superadmin/analytics/revenue?${params.toString()}`
    );
    return response.data.data;
  },

  getRestaurantGrowth: async (): Promise<RestaurantGrowthResponse> => {
    const response = await apiClient.get<ApiResponse<RestaurantGrowthResponse>>(
      '/api/superadmin/analytics/growth'
    );
    return response.data.data;
  },

  getTopRestaurants: async (): Promise<TopRestaurantsResponse> => {
    const response = await apiClient.get<ApiResponse<TopRestaurantsResponse>>(
      '/api/superadmin/analytics/top-restaurants'
    );
    return response.data.data;
  },

  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await apiClient.get<ApiResponse<PlatformStats>>(
      '/api/superadmin/analytics/stats'
    );
    return response.data.data;
  },
};

export default analyticsApi;
