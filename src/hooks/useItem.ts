import { useState, useEffect, useCallback } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';
import { useLibraryStore } from '../store/libraryStore';

interface UseItemResult {
  item: BaseItemDto | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch single item details
 */
export function useItem(itemId: string): UseItemResult {
  const { item, setItem } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItem = useCallback(async () => {
    if (!itemId) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiClient = getApiClient();
      const result = await apiClient.getItem(itemId);
      setItem(result as BaseItemDto);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch item'));
    } finally {
      setIsLoading(false);
    }
  }, [itemId, setItem]);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  return {
    item,
    isLoading,
    error,
    refresh: fetchItem
  };
}