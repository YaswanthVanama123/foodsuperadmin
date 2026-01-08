import React from 'react';
import { Filter, X } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface AuditLogFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    userId: string;
    action: string;
    resource: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  admins?: Array<{ id: string; name: string }>;
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  admins = [],
}) => {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const actionTypes = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'APPROVE', label: 'Approve' },
    { value: 'REJECT', label: 'Reject' },
    { value: 'SUSPEND', label: 'Suspend' },
    { value: 'ACTIVATE', label: 'Activate' },
  ];

  const resourceTypes = [
    { value: '', label: 'All Resources' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUBSCRIPTION', label: 'Subscription' },
    { value: 'PLAN', label: 'Plan' },
    { value: 'SUPPORT_TICKET', label: 'Support Ticket' },
    { value: 'SETTINGS', label: 'Settings' },
    { value: 'USER', label: 'User' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
  ];

  const adminOptions = [
    { value: '', label: 'All Admins' },
    ...admins.map((admin) => ({
      value: admin.id,
      label: admin.name,
    })),
  ];

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.userId ||
    filters.action ||
    filters.resource ||
    filters.status;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range */}
        <div>
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            placeholder="Select start date"
          />
        </div>
        <div>
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            placeholder="Select end date"
          />
        </div>

        {/* Admin Filter */}
        <div>
          <Select
            label="Admin"
            value={filters.userId}
            onChange={(e) => handleChange('userId', e.target.value)}
            options={adminOptions}
          />
        </div>

        {/* Action Type Filter */}
        <div>
          <Select
            label="Action Type"
            value={filters.action}
            onChange={(e) => handleChange('action', e.target.value)}
            options={actionTypes}
          />
        </div>

        {/* Resource Type Filter */}
        <div>
          <Select
            label="Resource Type"
            value={filters.resource}
            onChange={(e) => handleChange('resource', e.target.value)}
            options={resourceTypes}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.startDate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                From: {filters.startDate}
                <button
                  onClick={() => handleChange('startDate', '')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.endDate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                To: {filters.endDate}
                <button
                  onClick={() => handleChange('endDate', '')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.action && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Action: {filters.action}
                <button
                  onClick={() => handleChange('action', '')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.resource && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Resource: {filters.resource}
                <button
                  onClick={() => handleChange('resource', '')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Status: {filters.status}
                <button
                  onClick={() => handleChange('status', '')}
                  className="ml-2 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogFilters;
