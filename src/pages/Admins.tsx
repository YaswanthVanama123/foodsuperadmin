import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { PageHeader, SearchBar, Pagination, ConfirmDialog } from '../components/common';
import { AdminsTable, AdminForm, AdminDetailsModal, ResetPasswordModal } from '../components/admins';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import adminsApi, { Admin } from '../api/admins.api';

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [restaurants, setRestaurants] = useState<Array<{ _id: string; name: string; subdomain: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAdmins();
  }, [admins, searchQuery, selectedRestaurant, currentPage]);

  const loadData = async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);

      // OPTIMIZED: Single API call for both admins and restaurants
      const pageData = await adminsApi.getPageData(1000);
      setAdmins(pageData.admins);
      setRestaurants(pageData.restaurants);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load admins. Please try again.');
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const filterAdmins = () => {
    let filtered = [...admins];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (admin) => {
          const restaurantName = typeof admin.restaurantId === 'object'
            ? admin.restaurantId.name
            : '';

          return (
            admin.username.toLowerCase().includes(query) ||
            admin.email.toLowerCase().includes(query) ||
            (admin.firstName?.toLowerCase() || '').includes(query) ||
            (admin.lastName?.toLowerCase() || '').includes(query) ||
            restaurantName.toLowerCase().includes(query)
          );
        }
      );
    }

    // Filter by restaurant
    if (selectedRestaurant) {
      filtered = filtered.filter((admin) => {
        const restaurantId = typeof admin.restaurantId === 'object'
          ? admin.restaurantId._id
          : admin.restaurantId;
        return restaurantId === selectedRestaurant;
      });
    }

    setFilteredAdmins(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRestaurantFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRestaurant(e.target.value);
    setCurrentPage(1);
  };

  const handleAddAdmin = () => {
    setFormMode('create');
    setSelectedAdmin(null);
    setIsFormOpen(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setFormMode('edit');
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  };

  const handleViewDetails = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDetailsOpen(true);
  };

  const handleResetPassword = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsResetPasswordOpen(true);
  };

  const handleDeleteAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await adminsApi.delete(selectedAdmin._id);
      setIsDeleteDialogOpen(false);
      setSelectedAdmin(null);
      loadData();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const handleResetPasswordSuccess = () => {
    // Show success message
    alert('Password reset successfully!');
  };

  const restaurantOptions = [
    { value: '', label: 'All Restaurants' },
    ...restaurants.map((restaurant) => ({
      value: restaurant._id,
      label: restaurant.name,
    })),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Admins Management"
        subtitle="Manage restaurant administrators and their permissions"
      >
        <Button variant="primary" onClick={handleAddAdmin}>
          <UserPlus className="h-5 w-5 mr-2" />
          Add Admin
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{admins.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {admins.filter((admin) => admin.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Admins</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">
                {admins.filter((admin) => !admin.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            placeholder="Search by username, email, or name..."
            onSearch={handleSearch}
          />
          <Select
            options={restaurantOptions}
            value={selectedRestaurant}
            onChange={handleRestaurantFilter}
            placeholder="Filter by restaurant"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <AdminsTable
          admins={currentAdmins}
          isLoading={loading}
          onEdit={handleEditAdmin}
          onDelete={handleDeleteAdmin}
          onResetPassword={handleResetPassword}
          onViewDetails={handleViewDetails}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <AdminForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        admin={selectedAdmin}
        mode={formMode}
      />

      <AdminDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        admin={selectedAdmin}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        onSuccess={handleResetPasswordSuccess}
        admin={selectedAdmin}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${selectedAdmin?.username}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Admins;
