import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Building2,
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Sparkles,
} from 'lucide-react';
import { dashboardApiNew } from '../api';
import { PlatformStats, RecentActivity } from '../types';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable';
import { QuickActions } from '../components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }

      // Fetch stats and recent activity in parallel
      const [statsData, activityData] = await Promise.all([
        dashboardApiNew.getStats(),
        dashboardApiNew.getRecentActivity(10),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
      setError(errorMessage);

      if (!silent) {
        toast.error(errorMessage);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-violet-600"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-violet-600 animate-pulse" />
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching platform data</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mainStats = stats ? [
    {
      title: 'Total Restaurants',
      value: formatNumber(stats.totalRestaurants),
      icon: Building2,
      color: '#8b5cf6',
      trend: stats.totalRestaurants > 0 ? {
        value: 12.5,
        isPositive: true,
      } : undefined,
      subtitle: `${formatNumber(stats.activeRestaurants)} active`,
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(stats.activeSubscriptions),
      icon: CreditCard,
      color: '#10b981',
      trend: stats.activeSubscriptions > 0 ? {
        value: 8.3,
        isPositive: true,
      } : undefined,
      subtitle: `of ${formatNumber(stats.totalSubscriptions)} total`,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: '#f59e0b',
      trend: stats.revenueGrowth ? {
        value: stats.revenueGrowth,
        isPositive: stats.revenueGrowth > 0,
      } : undefined,
      subtitle: `${formatCurrency(stats.monthlyRevenue)} this month`,
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.activeUsers),
      icon: Users,
      color: '#3b82f6',
      trend: stats.userGrowth ? {
        value: stats.userGrowth,
        isPositive: stats.userGrowth > 0,
      } : undefined,
      subtitle: `${formatNumber(stats.totalUsers)} total users`,
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Sparkles className="w-8 h-8 text-violet-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Platform Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-11">
            Real-time overview of the Patlinks platform
          </p>
          <div className="flex items-center mt-2 ml-11">
            <Activity className="w-4 h-4 text-green-500 mr-2 animate-pulse" />
            <span className="text-sm text-gray-600">Live data - Updates every 30 seconds</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <StatsGrid stats={mainStats} />

        {/* Secondary Stats - Subscription Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Starter Plans</h3>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(stats.subscriptionsByPlan.starter)}
              </p>
              <p className="text-sm text-gray-600">
                Revenue: {formatCurrency(stats.revenueByPlan.starter)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Plans</h3>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(stats.subscriptionsByPlan.professional)}
              </p>
              <p className="text-sm text-gray-600">
                Revenue: {formatCurrency(stats.revenueByPlan.professional)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enterprise Plans</h3>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(stats.subscriptionsByPlan.enterprise)}
              </p>
              <p className="text-sm text-gray-600">
                Revenue: {formatCurrency(stats.revenueByPlan.enterprise)}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Recent Activity Table */}
        <div className="mb-8">
          <RecentActivityTable activities={recentActivity} loading={false} />
        </div>

        {/* Footer Stats */}
        {stats && (
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-2xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-violet-200 text-sm mb-2">Today's Orders</p>
                <p className="text-4xl font-bold">{formatNumber(stats.todayOrders)}</p>
              </div>
              <div className="text-center border-l border-r border-violet-400">
                <p className="text-violet-200 text-sm mb-2">Total Orders (All Time)</p>
                <p className="text-4xl font-bold">{formatNumber(stats.totalOrders)}</p>
              </div>
              <div className="text-center">
                <p className="text-violet-200 text-sm mb-2">Average Revenue per Restaurant</p>
                <p className="text-4xl font-bold">
                  {stats.totalRestaurants > 0
                    ? formatCurrency(stats.totalRevenue / stats.totalRestaurants)
                    : '$0'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
