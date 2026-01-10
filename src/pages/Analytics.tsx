import React, { useState, useEffect, useRef } from 'react';
import { subDays } from 'date-fns';
import { BarChart3, AlertCircle } from 'lucide-react';
import analyticsApi, { AnalyticsPageDataResponse } from '../api/analytics.api';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsPageDataResponse | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchAnalyticsData = async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);

      // OPTIMIZED: Single API call for all analytics data
      const data = await analyticsApi.getPageData(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const calculateAvgRevenuePerRestaurant = (): number => {
    if (!analyticsData?.stats) return 0;
    const totalRevenue = analyticsData.stats.revenue.totalRevenue || 0;
    const activeRestaurants = analyticsData.stats.restaurants.active || 0;
    if (activeRestaurants === 0) return 0;
    return totalRevenue / activeRestaurants;
  };

  const calculateRevenueGrowth = (): number => {
    if (!analyticsData?.revenue) return 0;
    return analyticsData.revenue.growthRate || 0;
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

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : analyticsData ? (
          <>
            {/* Platform Metrics Cards */}
            <PlatformMetricsCards
              totalRevenue={analyticsData.stats.revenue.totalRevenue || 0}
              avgRevenuePerRestaurant={calculateAvgRevenuePerRestaurant()}
              totalOrders={analyticsData.stats.orders.total || 0}
              activeUsers={analyticsData.stats.users.totalCustomers || 0}
              revenueGrowth={calculateRevenueGrowth()}
              avgRevenueGrowth={0}
              ordersGrowth={calculateOrdersGrowth()}
              usersGrowth={calculateUsersGrowth()}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2">
                <RevenueChart
                  data={analyticsData.revenue.data || []}
                  isLoading={false}
                />
              </div>

              {/* Restaurant Growth Chart */}
              <div className="lg:col-span-2">
                <RestaurantGrowthChart
                  data={analyticsData.growth.data || []}
                  isLoading={false}
                />
              </div>
            </div>

            {/* Top Restaurants Table */}
            <TopRestaurantsTable
              restaurants={analyticsData.topRestaurants.restaurants || []}
              isLoading={false}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Analytics;
