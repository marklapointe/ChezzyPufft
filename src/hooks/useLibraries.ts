import { useState, useEffect, useCallback } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';
import { useLibraryStore } from '../store/libraryStore';

interface UseLibrariesResult {
  libraries: BaseItemDto[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage library views (user views / libraries)
 */
export function useLibraries(): UseLibrariesResult {
  const { libraries, setLibraries } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLibraries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiClient = getApiClient();
      const result = await apiClient.getItems({
        sortBy: 'SortName',
        sortOrder: 'Ascending'
      });
      setLibraries(result.Items as BaseItemDto[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch libraries'));
    } finally {
      setIsLoading(false);
    }
  }, [setLibraries]);

  useEffect(() => {
    if (libraries.length === 0) {
      fetchLibraries();
    }
  }, [libraries.length, fetchLibraries]);

  return {
    libraries,
    isLoading,
    error,
    refresh: fetchLibraries
  };
}