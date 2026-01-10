import React, { useState, useEffect, useRef } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  SubscriptionsTable,
  SubscriptionForm,
  SubscriptionDetailsModal,
} from '../components/subscriptions';
import subscriptionsApi, { Subscription, SubscriptionsPageDataResponse } from '../api/subscriptions.api';
import { Plan } from '../api/plans.api';
import { Restaurant } from '../api/restaurants.api';

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'extend'>('create');

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  // Fetch subscriptions, plans, and restaurants (OPTIMIZED: Single API call)
  useEffect(() => {
    const fetchData = async () => {
      // Prevent concurrent requests
      if (isFetching.current) return;

      try {
        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        // OPTIMIZED: Single API call for subscriptions + plans + restaurants
        const data = await subscriptionsApi.getPageData();

        console.log('[Subscriptions] Page data:', data);
        setSubscriptions(data.subscriptions || []);
        setPlans(data.plans || []);
        setRestaurants(data.restaurants || []);
      } catch (err: any) {
        console.error('Failed to fetch subscriptions page data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    fetchData();
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      sub.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.planName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateNew = () => {
    setFormMode('create');
    setSelectedSubscription(null);
    setIsFormOpen(true);
  };

  const handleView = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  const handleExtend = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormMode('extend');
    setIsFormOpen(true);
  };

  const handleCancel = async (subscription: Subscription) => {
    if (window.confirm(`Are you sure you want to cancel the subscription for ${subscription.restaurantName}?`)) {
      try {
        await subscriptionsApi.cancel(subscription.id);
        alert('Subscription cancelled successfully');
        // Refresh data
        const data = await subscriptionsApi.getPageData();
        setSubscriptions(data.subscriptions || []);
      } catch (err: any) {
        alert(`Failed to cancel subscription: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (formMode === 'create') {
        await subscriptionsApi.create(data);
        alert('Subscription created successfully');
      } else {
        await subscriptionsApi.update(selectedSubscription!.id, {
          endDate: data.endDate,
        });
        alert('Subscription extended successfully');
      }

      setIsFormOpen(false);
      setSelectedSubscription(null);

      // Refresh data
      const pageData = await subscriptionsApi.getPageData();
      setSubscriptions(pageData.subscriptions || []);
    } catch (err: any) {
      alert(`Failed to ${formMode} subscription: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscriptions</h1>
          <p className="text-gray-600">Manage restaurant subscriptions and billing</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Subscriptions</p>
            <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-green-100 mb-1">Active</p>
            <p className="text-3xl font-bold">
              {subscriptions.filter((s) => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-red-100 mb-1">Expired</p>
            <p className="text-3xl font-bold">
              {subscriptions.filter((s) => s.status === 'expired').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm text-gray-100 mb-1">Cancelled</p>
            <p className="text-3xl font-bold">
              {subscriptions.filter((s) => s.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by restaurant or plan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </Select>
              </div>
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateNew} className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Subscription</span>
            </Button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <SubscriptionsTable
            subscriptions={filteredSubscriptions}
            isLoading={isLoading}
            onView={handleView}
            onExtend={handleExtend}
            onCancel={handleCancel}
          />
        </div>

        {/* Modals */}
        <SubscriptionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSubscription(null);
          }}
          onSubmit={handleFormSubmit}
          restaurants={restaurants}
          plans={plans}
          mode={formMode}
          initialData={
            selectedSubscription
              ? {
                  restaurantId: selectedSubscription.restaurantId,
                  planId: selectedSubscription.planId,
                  startDate: selectedSubscription.endDate,
                  billingCycle: selectedSubscription.billingCycle,
                }
              : undefined
          }
        />

        <SubscriptionDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedSubscription(null);
          }}
          subscription={selectedSubscription}
        />
      </div>
    </div>
  );
};

export default Subscriptions;
