import { useState, useEffect, useCallback } from 'react';
import { getApiClient } from '../api/client';
import type { BaseItemDto } from '../api/types';
import { useLibraryStore } from '../store/libraryStore';

interface GetItemsOptions {
  userId?: string;
  parentId?: string;
  searchTerm?: string;
  types?: string[];
  includeMediaTypes?: string[];
  sortBy?: string | string[];
  sortOrder?: 'Ascending' | 'Descending';
  limit?: number;
  startIndex?: number;
}

interface UseLibraryItemsResult {
  items: BaseItemDto[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
}

interface UseLibraryItemsOptions extends Omit<GetItemsOptions, 'parentId'> {
  limit?: number;
}

export function useLibraryItems(
  parentId: string | null,
  options?: UseLibraryItemsOptions
): UseLibraryItemsResult {
  const { setItems, setItem } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [allItems, setAllItems] = useState<BaseItemDto[]>([]);
  const limit = options?.limit ?? 24;

  const fetchItems = useCallback(
    async (reset = false) => {
      // Allow null parentId when includeMediaTypes is provided (for fetching by media type)
      if (parentId === null && !options?.includeMediaTypes?.length) return;

      setIsLoading(true);
      setError(null);

      try {
        const apiClient = getApiClient();
        const currentStartIndex = reset ? 0 : startIndex;
        const result = await apiClient.getItems({
          ...options,
parentId: parentId ?? undefined,
          startIndex: currentStartIndex,
          limit
        });

        const newItems = result.Items as BaseItemDto[];
        if (reset) {
          setAllItems(newItems);
          setStartIndex(limit);
        } else {
          setAllItems((prev) => [...prev, ...newItems]);
          setStartIndex((prev) => prev + limit);
        }
        setTotalCount(result.TotalRecordCount);
        setItems(newItems);
        setItem(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch items'));
      } finally {
        setIsLoading(false);
      }
    },
    [parentId, options, startIndex, limit, setItems, setItem]
  );

  useEffect(() => {
    setAllItems([]);
    setStartIndex(0);
    setTotalCount(0);
    fetchItems(true);
  }, [parentId]);

  const loadMore = useCallback(async () => {
    if (!isLoading && allItems.length < totalCount) {
      await fetchItems(false);
    }
  }, [fetchItems, isLoading, allItems.length, totalCount]);

  return {
    items: allItems,
    totalCount,
    isLoading,
    error,
    loadMore
  };
}