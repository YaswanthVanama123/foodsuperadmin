import React from 'react';
import { Eye, Calendar, XCircle } from 'lucide-react';
import { Subscription } from '../../api/subscriptions.api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/format';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: Subscription) => React.ReactNode;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onView?: (subscription: Subscription) => void;
  onExtend?: (subscription: Subscription) => void;
  onCancel?: (subscription: Subscription) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'danger';
    case 'cancelled':
      return 'gray';
    case 'pending':
      return 'warning';
    default:
      return 'gray';
  }
};

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  isLoading = false,
  onView,
  onExtend,
  onCancel,
}) => {
  const columns: Column[] = [
    {
      key: 'restaurantName',
      label: 'Restaurant',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.restaurantName || 'N/A'}</p>
          <p className="text-xs text-gray-500">ID: {item.restaurantId}</p>
        </div>
      ),
    },
    {
      key: 'planName',
      label: 'Plan',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.planName || 'N/A'}</p>
          <p className="text-xs text-gray-500 capitalize">{item.billingCycle}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-700">{formatDate(item.startDate)}</span>
      ),
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-gray-700">{formatDate(item.endDate)}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Price',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
          <p className="text-xs text-gray-500">{item.currency}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center space-x-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(item)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onExtend && item.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExtend(item)}
              title="Extend Subscription"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          {onCancel && item.status === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(item)}
              title="Cancel Subscription"
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No subscriptions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((subscription) => (
            <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={`${subscription.id}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.render ? column.render(subscription) : subscription[column.key as keyof Subscription]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionsTable;
