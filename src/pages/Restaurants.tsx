import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Trash, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import {
  RestaurantsTable,
  RestaurantForm,
  RestaurantDetailsModal,
  RestaurantFilters,
} from '../components/restaurants';
import { useRestaurants } from '../hooks/useRestaurants';
import { Restaurant } from '../api/restaurants.api';
import { RestaurantFormData } from '../components/restaurants/RestaurantForm';

const Restaurants: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | undefined>();
  const [viewRestaurant, setViewRestaurant] = useState<Restaurant | null>(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    restaurants,
    isLoading,
    totalPages,
    total,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    updateStatus,
  } = useRestaurants();

  // Filter restaurants based on status and subscription
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesStatus = statusFilter === '' ||
        (statusFilter === 'active' && restaurant.isActive) ||
        (statusFilter === 'inactive' && !restaurant.isActive) ||
        (statusFilter === 'suspended' && restaurant.subscription?.status === 'cancelled');
      const matchesSubscription =
        subscriptionFilter === '' || restaurant.subscription?.plan === subscriptionFilter;
      return matchesStatus && matchesSubscription;
    });
  }, [restaurants, statusFilter, subscriptionFilter]);

  const handleAddRestaurant = useCallback(() => {
    setSelectedRestaurant(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditRestaurant = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsFormOpen(true);
  }, []);

  const handleViewRestaurant = useCallback((restaurant: Restaurant) => {
    setViewRestaurant(restaurant);
    setIsDetailsOpen(true);
  }, []);

  const handleDeleteClick = useCallback((restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (restaurantToDelete) {
      try {
        await deleteRestaurant(restaurantToDelete._id);
        setRestaurantToDelete(null);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  }, [restaurantToDelete, deleteRestaurant]);

  const handleStatusChange = useCallback(async (
    restaurant: Restaurant,
    status: 'active' | 'inactive' | 'suspended'
  ) => {
    try {
      await updateStatus(restaurant._id, status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, [updateStatus]);

  const handleSubmit = useCallback(async (data: RestaurantFormData) => {
    if (selectedRestaurant) {
      await updateRestaurant(selectedRestaurant._id, data);
    } else {
      await createRestaurant(data);
    }
    setIsFormOpen(false);
  }, [selectedRestaurant, updateRestaurant, createRestaurant]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    fetchRestaurants(1, 10, value);
  }, [fetchRestaurants]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchRestaurants(page, 10, searchQuery);
  }, [fetchRestaurants, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Restaurants Management"
        subtitle="Manage all restaurants on the platform"
        actions={
          <Button variant="primary" onClick={handleAddRestaurant}>
            <Plus className="h-5 w-5 mr-2" />
            Add Restaurant
          </Button>
        }
      />

      {/* Filters */}
      <RestaurantFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        subscriptionFilter={subscriptionFilter}
        onSubscriptionChange={setSubscriptionFilter}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Total Restaurants</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {restaurants.filter((r) => r.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Inactive</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {restaurants.filter((r) => !r.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Suspended</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {restaurants.filter((r) => r.subscription?.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <RestaurantsTable
        restaurants={filteredRestaurants}
        isLoading={isLoading}
        onView={handleViewRestaurant}
        onEdit={handleEditRestaurant}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Restaurant Form Modal */}
      <RestaurantForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        restaurant={selectedRestaurant}
      />

      {/* Restaurant Details Modal */}
      <RestaurantDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        restaurant={viewRestaurant}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!restaurantToDelete}
        onClose={() => setRestaurantToDelete(null)}
        title="Delete Restaurant"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 mb-2">
              Do you really want to delete "{restaurantToDelete?.name}"?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">Warning</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This action cannot be undone. All associated data including orders, menu items, and
                    users will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setRestaurantToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Restaurant
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Restaurants;
