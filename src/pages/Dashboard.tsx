import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { dashboardApi } from '../api';
import { PlatformStats, RecentActivity } from '../types';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable';
import { QuickActions } from '../components/dashboard/QuickActions';

// Plan pricing for revenue calculation
const PLAN_PRICING: Record<string, number> = {
  'Starter': 29,
  'Professional': 79,
  'Enterprise': 199,
  'starter': 29,
  'professional': 79,
  'enterprise': 199,
  'basic': 29,
  'pro': 79,
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (silent: boolean = false) => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;

      if (!silent) {
        setLoading(true);
        setError(null);
      }

      // OPTIMIZED: Single API call for both stats and recent activity
      const pageData = await dashboardApi.getPageData(10);
      setStats(pageData.stats);
      setRecentActivity(pageData.recentActivity.activities || []);
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
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Helper to get plan count
  const getPlanCount = (planName: string): number => {
    if (!stats?.subscriptions.byPlan) return 0;
    return stats.subscriptions.byPlan[planName] ||
           stats.subscriptions.byPlan[planName.toLowerCase()] ||
           0;
  };

  // Helper to calculate revenue for a plan
  const getPlanRevenue = (planName: string): number => {
    const count = getPlanCount(planName);
    const price = PLAN_PRICING[planName] || PLAN_PRICING[planName.toLowerCase()] || 0;
    return count * price;
  };

  // Calculate total active subscriptions
  const getActiveSubscriptions = (): number => {
    if (!stats?.subscriptions.byStatus) return 0;
    return stats.subscriptions.byStatus['active'] ||
           stats.subscriptions.byStatus['Active'] ||
           0;
  };

  // Calculate total subscriptions
  const getTotalSubscriptions = (): number => {
    if (!stats?.subscriptions.byStatus) return 0;
    return Object.values(stats.subscriptions.byStatus).reduce((sum, count) => sum + count, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
      <div className="flex items-center justify-center min-h-[60vh]">
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
      value: formatNumber(stats.restaurants.total),
      icon: Building2,
      color: '#8b5cf6',
      trend: stats.restaurants.total > 0 ? {
        value: 12.5,
        isPositive: true,
      } : undefined,
      subtitle: `${formatNumber(stats.restaurants.active)} active`,
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(getActiveSubscriptions()),
      icon: CreditCard,
      color: '#10b981',
      trend: getActiveSubscriptions() > 0 ? {
        value: 8.3,
        isPositive: true,
      } : undefined,
      subtitle: `of ${formatNumber(getTotalSubscriptions())} total`,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.revenue.totalRevenue),
      icon: DollarSign,
      color: '#f59e0b',
      subtitle: `${formatCurrency(stats.revenue.totalMonthlyRecurring)} monthly recurring`,
    },
    {
      title: 'Active Users',
      value: formatNumber(stats.users.activeCustomers),
      icon: Users,
      color: '#3b82f6',
      subtitle: `${formatNumber(stats.users.totalCustomers)} total customers`,
    },
  ] : [];

  return (
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
          <span className="text-sm text-gray-600">Platform overview</span>
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
              {formatNumber(getPlanCount('Starter'))}
            </p>
            <p className="text-sm text-gray-600">
              Revenue: {formatCurrency(getPlanRevenue('Starter'))}
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
              {formatNumber(getPlanCount('Professional'))}
            </p>
            <p className="text-sm text-gray-600">
              Revenue: {formatCurrency(getPlanRevenue('Professional'))}
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
              {formatNumber(getPlanCount('Enterprise'))}
            </p>
            <p className="text-sm text-gray-600">
              Revenue: {formatCurrency(getPlanRevenue('Enterprise'))}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <RecentActivityTable activities={recentActivity} />
        </div>
      )}

      {/* Empty State */}
      {stats && stats.restaurants.total === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Restaurants Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first restaurant on the platform.
          </p>
          <button
            onClick={() => navigate('/restaurants')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Create Restaurant
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
