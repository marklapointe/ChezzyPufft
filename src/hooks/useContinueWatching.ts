import { useState, useEffect, useCallback } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';
import { useLibraryStore } from '../store/libraryStore';

interface UseContinueWatchingResult {
  items: BaseItemDto[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for continue watching items (items with playback position > 0)
 * Filters items that have UserItemData with PlaybackPositionTicks > 0
 */
export function useContinueWatching(userId: string): UseContinueWatchingResult {
  const { continueWatching, setContinueWatching } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContinueWatching = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiClient = getApiClient();
      const result = await apiClient.getItems({
        userId,
        sortBy: 'DatePlayed',
        sortOrder: 'Descending',
        limit: 20
      });

      const items = (result.Items as BaseItemDto[]).filter((item) => {
        const userData = (item as unknown as { UserData?: { PlaybackPositionTicks?: number } }).UserData;
        return userData?.PlaybackPositionTicks && userData.PlaybackPositionTicks > 0;
      });

      setContinueWatching(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch continue watching'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, setContinueWatching]);

  useEffect(() => {
    fetchContinueWatching();
  }, [userId]);

  return {
    items: continueWatching,
    isLoading,
    error,
    refresh: fetchContinueWatching
  };
}