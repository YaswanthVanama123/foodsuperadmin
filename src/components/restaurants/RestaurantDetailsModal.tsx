import React, { useState } from 'react';
import Modal, { ModalBody } from '../ui/Modal';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Restaurant } from '../../types';
import { formatDate } from '../../utils/format';
import { Building2, Mail, Phone, MapPin, Calendar, Users, TrendingUp, CreditCard } from 'lucide-react';

interface RestaurantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
}

type TabType = 'info' | 'subscription' | 'admins' | 'stats';

const RestaurantDetailsModal: React.FC<RestaurantDetailsModalProps> = ({
  isOpen,
  onClose,
  restaurant,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  if (!restaurant) return null;

  const tabs = [
    { id: 'info' as TabType, label: 'Information', icon: Building2 },
    { id: 'subscription' as TabType, label: 'Subscription', icon: CreditCard },
    { id: 'admins' as TabType, label: 'Admins', icon: Users },
    { id: 'stats' as TabType, label: 'Statistics', icon: TrendingUp },
  ];

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

  const renderInfoTab = () => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
          <p className="text-sm text-gray-500 mt-1">@{restaurant.slug}</p>
        </div>
        {getStatusBadge(restaurant.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{restaurant.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{restaurant.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm text-gray-900">{restaurant.address}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-sm text-gray-900">{formatDate(restaurant.createdAt)}</p>
            </div>
          </div>

          {restaurant.updatedAt && (
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(restaurant.updatedAt)}</p>
              </div>
            </div>
          )}

          {restaurant.ownerId && (
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Owner ID</p>
                <p className="text-sm text-gray-900 font-mono">{restaurant.ownerId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      {restaurant.subscription ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                  {restaurant.subscription.plan}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-2">
                  <Badge
                    variant={
                      restaurant.subscription.status === 'active'
                        ? 'success'
                        : restaurant.subscription.status === 'expired'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {restaurant.subscription.status.charAt(0).toUpperCase() +
                      restaurant.subscription.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${restaurant.subscription.price}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
              </div>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(restaurant.subscription.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(restaurant.subscription.endDate)}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-sm text-gray-500">This restaurant does not have an active subscription.</p>
        </div>
      )}
    </div>
  );

  const renderAdminsTab = () => (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurant Admins</h3>
        <p className="text-sm text-gray-500">
          Admin management functionality coming soon.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This feature will allow you to view and manage restaurant administrators.
        </p>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">$0</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
            <p className="text-xs text-gray-400 mt-1">Current month</p>
          </div>
        </Card>
      </div>

      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Statistics Dashboard</h3>
        <p className="text-sm text-gray-500">
          Detailed analytics and statistics coming soon.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This feature will include revenue trends, order analytics, and performance metrics.
        </p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalBody>
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'subscription' && renderSubscriptionTab()}
            {activeTab === 'admins' && renderAdminsTab()}
            {activeTab === 'stats' && renderStatsTab()}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default RestaurantDetailsModal;
