import { useState, useEffect, useCallback, useRef } from 'react';
import plansApi, { Plan } from '../api/plans.api';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchPlans = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      const response = await plansApi.getAll();

      // Safe access with fallback
      if (response && response.plans) {
        setPlans(response.plans);
      } else {
        console.error('Invalid response structure from plans API:', response);
        setPlans([]);
        setError('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch plans';
      setError(errorMessage);
      console.error('Error fetching plans:', err);
      setPlans([]);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = useCallback(async (data: any) => {
    try {
      const newPlan = await plansApi.create(data);
      await fetchPlans(); // Refresh the list to ensure consistency
      return { success: true, data: newPlan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create plan';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchPlans]);

  const updatePlan = useCallback(async (id: string, data: any) => {
    try {
      const updatedPlan = await plansApi.update(id, data);
      await fetchPlans(); // Refresh the list to ensure consistency
      return { success: true, data: updatedPlan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update plan';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchPlans]);

  const deletePlan = useCallback(async (id: string) => {
    try {
      await plansApi.delete(id);
      await fetchPlans(); // Refresh the list to ensure consistency
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete plan';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchPlans]);

  const getActivePlans = useCallback(() => {
    return plans.filter((plan) => plan.isActive);
  }, [plans]);

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    activePlans: getActivePlans(),
  };
};
