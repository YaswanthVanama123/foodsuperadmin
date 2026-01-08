import React from 'react';
import { RecentActivity } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import {
  Store,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
  Ban,
  RotateCcw,
  UserPlus,
  UserMinus,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RecentActivityTableProps {
  activities: RecentActivity[];
  loading?: boolean;
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'restaurant_created':
      return <Store className="w-5 h-5 text-blue-600" />;
    case 'restaurant_activated':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'restaurant_suspended':
      return <Ban className="w-5 h-5 text-red-600" />;
    case 'subscription_created':
      return <CreditCard className="w-5 h-5 text-purple-600" />;
    case 'subscription_upgraded':
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    case 'subscription_cancelled':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'subscription_renewed':
      return <RotateCcw className="w-5 h-5 text-blue-600" />;
    case 'admin_created':
      return <UserPlus className="w-5 h-5 text-green-600" />;
    case 'admin_deleted':
      return <UserMinus className="w-5 h-5 text-red-600" />;
    case 'payment_received':
      return <DollarSign className="w-5 h-5 text-green-600" />;
    case 'payment_failed':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-600" />;
  }
};

const getActivityBadgeVariant = (action: string): 'success' | 'warning' | 'danger' | 'info' => {
  if (action.includes('created') || action.includes('activated') || action.includes('received') || action.includes('upgraded')) {
    return 'success';
  }
  if (action.includes('suspended') || action.includes('cancelled') || action.includes('deleted') || action.includes('failed')) {
    return 'danger';
  }
  if (action.includes('renewed')) {
    return 'info';
  }
  return 'info';
};

const formatActionText = (action: string): string => {
  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <p className="text-sm text-gray-600 mt-1">Last 10 platform actions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="mr-3">{getActivityIcon(activity.action)}</div>
                    <Badge variant={getActivityBadgeVariant(activity.action)}>
                      {formatActionText(activity.action)}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  {activity.performedBy && (
                    <p className="text-xs text-gray-500 mt-1">by {activity.performedBy}</p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activity.restaurantName ? (
                    <div className="flex items-center">
                      <Store className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{activity.restaurantName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
