import { useState, useEffect, useCallback } from 'react';
import plansApi, { Plan } from '../api/plans.api';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await plansApi.getAll();
      setPlans(response.plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
      console.error('Error fetching plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = useCallback(async (data: any) => {
    try {
      const newPlan = await plansApi.create(data);
      setPlans((prev) => [newPlan, ...prev]);
      return { success: true, data: newPlan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create plan';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const updatePlan = useCallback(async (id: string, data: any) => {
    try {
      const updatedPlan = await plansApi.update(id, data);
      setPlans((prev) =>
        prev.map((plan) => (plan.id === id ? updatedPlan : plan))
      );
      return { success: true, data: updatedPlan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update plan';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    try {
      await plansApi.delete(id);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete plan';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

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
