import { useState, useEffect, useCallback, useRef } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';

interface UseSearchResult {
  items: BaseItemDto[];
  isLoading: boolean;
  clearSearch: () => void;
}

/**
 * Hook for searching items
 */
export function useSearch(searchTerm: string): UseSearchResult {
  const [items, setItems] = useState<BaseItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setItems([]);
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setItems([]);
      return;
    }

    const fetchSearchResults = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const apiClient = getApiClient();
        const result = await apiClient.getItems({
          searchTerm: searchTerm.trim(),
          limit: 50
        });

        setItems(result.Items as BaseItemDto[]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 300);

    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm]);

  return {
    items,
    isLoading,
    clearSearch
  };
}