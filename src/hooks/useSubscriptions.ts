import { useState, useEffect, useCallback, useRef } from 'react';
import subscriptionsApi, { Subscription } from '../api/subscriptions.api';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchSubscriptions = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      const response = await subscriptionsApi.getAll();

      // Safe access with fallback
      if (response && response.subscriptions) {
        setSubscriptions(response.subscriptions);
      } else {
        console.error('Invalid response structure from subscriptions API:', response);
        setSubscriptions([]);
        setError('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscriptions';
      setError(errorMessage);
      console.error('Error fetching subscriptions:', err);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
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
