import { useState, useEffect, useCallback } from 'react';
import subscriptionsApi, { Subscription } from '../api/subscriptions.api';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await subscriptionsApi.getAll();
      setSubscriptions(response.subscriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const cancelSubscription = useCallback(async (id: string) => {
    try {
      const updatedSubscription = await subscriptionsApi.cancel(id);
      await fetchSubscriptions(); // Refresh the list to ensure consistency
      return { success: true, data: updatedSubscription };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchSubscriptions]);

  const updateSubscription = useCallback(async (id: string, data: any) => {
    try {
      const updatedSubscription = await subscriptionsApi.update(id, data);
      await fetchSubscriptions(); // Refresh the list to ensure consistency
      return { success: true, data: updatedSubscription };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchSubscriptions]);

  const createSubscription = useCallback(async (data: any) => {
    try {
      const newSubscription = await subscriptionsApi.create(data);
      await fetchSubscriptions(); // Refresh the list to ensure consistency
      return { success: true, data: newSubscription };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(message);
      return { success: false, error: message };
    }
  }, [fetchSubscriptions]);

  const getActiveSubscriptions = useCallback(() => {
    return subscriptions.filter((sub) => sub.status === 'active');
  }, [subscriptions]);

  const getExpiredSubscriptions = useCallback(() => {
    return subscriptions.filter((sub) => sub.status === 'expired');
  }, [subscriptions]);

  const getCancelledSubscriptions = useCallback(() => {
    return subscriptions.filter((sub) => sub.status === 'cancelled');
  }, [subscriptions]);

  return {
    subscriptions,
    isLoading,
    error,
    fetchSubscriptions,
    cancelSubscription,
    updateSubscription,
    createSubscription,
    activeSubscriptions: getActiveSubscriptions(),
    expiredSubscriptions: getExpiredSubscriptions(),
    cancelledSubscriptions: getCancelledSubscriptions(),
  };
};
