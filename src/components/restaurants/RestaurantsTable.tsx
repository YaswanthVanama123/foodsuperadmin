import React from 'react';
import { MoreVertical, Eye, Edit, Ban, CheckCircle, Trash } from 'lucide-react';
import DataTable, { Column } from '../common/DataTable';
import Badge from '../ui/Badge';
import { Restaurant } from '../../types';
import { formatDate } from '../../utils/format';

interface RestaurantsTableProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  onView: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onStatusChange: (restaurant: Restaurant, status: 'active' | 'suspended' | 'pending') => void;
  onDelete: (restaurant: Restaurant) => void;
}

const RestaurantsTable: React.FC<RestaurantsTableProps> = ({
  restaurants,
  isLoading,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: any) => {
    if (!subscription) {
      return <Badge variant="gray">No Plan</Badge>;
    }

    const planColors: Record<string, 'primary' | 'secondary' | 'info'> = {
      starter: 'gray' as 'primary',
      professional: 'primary',
      enterprise: 'info',
    };

    return (
      <Badge variant={planColors[subscription.plan] || 'gray'}>
        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
      </Badge>
    );
  };

  const columns: Column<Restaurant>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (restaurant) => (
        <div>
          <div className="font-medium text-gray-900">{restaurant.name}</div>
          <div className="text-sm text-gray-500">{restaurant.slug}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (restaurant) => (
        <div>
          <div className="text-gray-900">{restaurant.email}</div>
          <div className="text-sm text-gray-500">{restaurant.phone}</div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Location',
      render: (restaurant) => (
        <div className="text-sm text-gray-700">
          {restaurant.address}
        </div>
      ),
    },
    {
      key: 'subscription',
      label: 'Subscription',
      sortable: true,
      render: (restaurant) => getSubscriptionBadge(restaurant.subscription),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (restaurant) => getStatusBadge(restaurant.status),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (restaurant) => (
        <div className="text-sm text-gray-700">
          {formatDate(restaurant.createdAt)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (restaurant) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(restaurant);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(restaurant);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          {restaurant.status === 'active' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(restaurant, 'suspended');
              }}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Suspend"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(restaurant, 'active');
              }}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              title="Activate"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(restaurant);
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={restaurants}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No restaurants found"
      rowKey="id"
    />
  );
};

export default RestaurantsTable;
