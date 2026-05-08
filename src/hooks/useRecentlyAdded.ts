import { useState, useEffect, useCallback } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';
import { useLibraryStore } from '../store/libraryStore';

interface UseRecentlyAddedResult {
  items: BaseItemDto[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for recently added items sorted by date
 */
export function useRecentlyAdded(userId: string, limit = 20): UseRecentlyAddedResult {
  const { recentlyAdded, setRecentlyAdded } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecentlyAdded = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiClient = getApiClient();
      const result = await apiClient.getItems({
        userId,
        sortBy: 'DateCreated',
        sortOrder: 'Descending',
        limit
      });

      setRecentlyAdded(result.Items as BaseItemDto[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recently added'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit, setRecentlyAdded]);

  useEffect(() => {
    fetchRecentlyAdded();
  }, [userId, limit]);

  return {
    items: recentlyAdded,
    isLoading,
    error,
    refresh: fetchRecentlyAdded
  };
}