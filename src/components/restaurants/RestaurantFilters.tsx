import React from 'react';
import SearchBar from '../common/SearchBar';
import Select from '../ui/Select';
import { Filter } from 'lucide-react';

interface RestaurantFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  subscriptionFilter: string;
  onSubscriptionChange: (value: string) => void;
}

const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  subscriptionFilter,
  onSubscriptionChange,
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' },
  ];

  const subscriptionOptions = [
    { value: '', label: 'All Plans' },
    { value: 'starter', label: 'Starter' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <Filter className="h-5 w-5" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <SearchBar
            placeholder="Search restaurants..."
            onSearch={onSearchChange}
            defaultValue={searchQuery}
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </div>

        <div>
          <Select
            value={subscriptionFilter}
            onChange={(e) => onSubscriptionChange(e.target.value)}
            options={subscriptionOptions}
            placeholder="Filter by subscription"
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilters;
