import React, { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import { BarChart3, AlertCircle } from 'lucide-react';
import analyticsApi, {
  PlatformRevenueResponse,
  RestaurantGrowthResponse,
  TopRestaurantsResponse,
} from '../api/analytics.api';
import dashboardApi from '../api/dashboard.api';
import { PlatformStats } from '../types';
import {
  DateRangePicker,
  PlatformMetricsCards,
  RevenueChart,
  RestaurantGrowthChart,
  TopRestaurantsTable,
} from '../components/analytics';

const Analytics: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 29));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(true);
  const [isLoadingTopRestaurants, setIsLoadingTopRestaurants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [revenueData, setRevenueData] = useState<PlatformRevenueResponse | null>(
    null
  );
  const [growthData, setGrowthData] = useState<RestaurantGrowthResponse | null>(
    null
  );
  const [topRestaurants, setTopRestaurants] =
    useState<TopRestaurantsResponse | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  const fetchRevenueData = async () => {
    try {
      setIsLoadingRevenue(true);
      setError(null);
      const data = await analyticsApi.getPlatformRevenue(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setRevenueData(data);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data');
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  const fetchGrowthData = async () => {
    try {
      setIsLoadingGrowth(true);
      const data = await analyticsApi.getRestaurantGrowth();
      setGrowthData(data);
    } catch (err) {
      console.error('Error fetching growth data:', err);
    } finally {
      setIsLoadingGrowth(false);
    }
  };

  const fetchTopRestaurants = async () => {
    try {
      setIsLoadingTopRestaurants(true);
      const data = await analyticsApi.getTopRestaurants();
      setTopRestaurants(data);
    } catch (err) {
      console.error('Error fetching top restaurants:', err);
    } finally {
      setIsLoadingTopRestaurants(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [startDate, endDate]);

  useEffect(() => {
    fetchGrowthData();
    fetchTopRestaurants();
    fetchStats();
  }, []);

  const handleDateRangeChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const calculateAvgRevenuePerRestaurant = (): number => {
    if (!stats || !stats.revenue || !stats.restaurants) return 0;
    const totalRevenue = stats.revenue.totalRevenue || 0;
    const activeRestaurants = stats.restaurants.active || 0;
    if (activeRestaurants === 0) return 0;
    return totalRevenue / activeRestaurants;
  };

  const calculateRevenueGrowth = (): number => {
    if (!revenueData) return 0;
    return revenueData.growthRate || 0;
  };

  const calculateOrdersGrowth = (): number => {
    // TODO: Implement actual growth calculation when historical data is available
    return 0;
  };

  const calculateUsersGrowth = (): number => {
    // TODO: Implement actual growth calculation when historical data is available
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Platform Analytics
              </h1>
            </div>
            <p className="text-gray-600 ml-16">
              Comprehensive insights into platform performance and restaurant metrics
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateRangeChange}
        />

        {/* Platform Metrics Cards */}
        {stats && (
          <PlatformMetricsCards
            totalRevenue={stats.revenue?.totalRevenue || 0}
            avgRevenuePerRestaurant={calculateAvgRevenuePerRestaurant()}
            totalOrders={stats.orders?.total || 0}
            activeUsers={stats.users?.totalCustomers || 0}
            revenueGrowth={calculateRevenueGrowth()}
            avgRevenueGrowth={0}
            ordersGrowth={calculateOrdersGrowth()}
            usersGrowth={calculateUsersGrowth()}
          />
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart
              data={revenueData?.data || []}
              isLoading={isLoadingRevenue}
            />
          </div>

          {/* Restaurant Growth Chart */}
          <div className="lg:col-span-2">
            <RestaurantGrowthChart
              data={growthData?.data || []}
              isLoading={isLoadingGrowth}
            />
          </div>
        </div>

        {/* Top Restaurants Table */}
        <TopRestaurantsTable
          restaurants={topRestaurants?.restaurants || []}
          isLoading={isLoadingTopRestaurants}
        />
      </div>
    </div>
  );
};

export default Analytics;
