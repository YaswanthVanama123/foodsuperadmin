import { useState, useEffect, useCallback } from 'react';
import restaurantsApi, { Restaurant } from '../api/restaurants.api';
import { toast } from 'react-hot-toast';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  fetchRestaurants: (page?: number, limit?: number, search?: string) => Promise<void>;
  createRestaurant: (data: any) => Promise<void>;
  updateRestaurant: (id: string, data: any) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  updateStatus: (id: string, status: 'active' | 'inactive' | 'suspended') => Promise<void>;
  refetch: () => Promise<void>;
}

export const useRestaurants = (): UseRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastFetchParams, setLastFetchParams] = useState<{
    page?: number;
    limit?: number;
    search?: string;
  }>({});

  const fetchRestaurants = useCallback(async (page = 1, limit = 10, search = '') => {
    setIsLoading(true);
    setError(null);
    setLastFetchParams({ page, limit, search });

    try {
      const response = await restaurantsApi.getAll({ page, limit, search });
      setRestaurants(response.restaurants);
      setTotalPages(response.pagination.pages);
      setCurrentPage(response.pagination.page);
      setTotal(response.pagination.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch restaurants';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRestaurant = useCallback(async (data: any) => {
    try {
      await restaurantsApi.create(data);
      toast.success('Restaurant created successfully');
      await fetchRestaurants(lastFetchParams.page, lastFetchParams.limit, lastFetchParams.search);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create restaurant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRestaurants, lastFetchParams]);

  const updateRestaurant = useCallback(async (id: string, data: any) => {
    try {
      await restaurantsApi.update(id, data);
      toast.success('Restaurant updated successfully');
      await fetchRestaurants(lastFetchParams.page, lastFetchParams.limit, lastFetchParams.search);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update restaurant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRestaurants, lastFetchParams]);

  const deleteRestaurant = useCallback(async (id: string) => {
    try {
      await restaurantsApi.delete(id);
      toast.success('Restaurant deleted successfully');
      await fetchRestaurants(lastFetchParams.page, lastFetchParams.limit, lastFetchParams.search);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete restaurant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRestaurants, lastFetchParams]);

  const updateStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await restaurantsApi.updateStatus(id, status);
      toast.success(`Restaurant ${status === 'active' ? 'activated' : status === 'suspended' ? 'suspended' : 'deactivated'} successfully`);
      await fetchRestaurants(lastFetchParams.page, lastFetchParams.limit, lastFetchParams.search);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update restaurant status';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchRestaurants, lastFetchParams]);

  const refetch = useCallback(async () => {
    await fetchRestaurants(lastFetchParams.page, lastFetchParams.limit, lastFetchParams.search);
  }, [fetchRestaurants, lastFetchParams]);

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    restaurants,
    isLoading,
    error,
    totalPages,
    currentPage,
    total,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    updateStatus,
    refetch,
  };
};
