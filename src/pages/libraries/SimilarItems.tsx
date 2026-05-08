import { useEffect, useState } from 'react';
import type { BaseItemDto, ItemsResult } from '../../api/types';
import { getApiClient } from '../../api/client';
import { MediaCard } from '../../components/media/MediaCard';

interface SimilarItemsProps {
  itemId: string;
  itemType?: string;
  title?: string;
  limit?: number;
}

export function SimilarItems({
  itemId,
  itemType,
  title = 'Similar',
  limit = 10
}: SimilarItemsProps) {
  const [items, setItems] = useState<BaseItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarItems = async () => {
      if (!itemId) return;

      setIsLoading(true);
      setError(null);

      try {
        const client = getApiClient();
        const params = new URLSearchParams({
          UserId: '1',
          Limit: limit.toString(),
          Fields: 'PrimaryImageAspectRatio,CommunityRating'
        });

        if (itemType) {
          params.append('IncludeItemTypes', itemType);
        }

        const response = await client.request<ItemsResult>(
          `/Items/${itemId}/Similar?${params.toString()}`
        );

        setItems(response.Items as BaseItemDto[]);
      } catch (err) {
        console.error('Failed to fetch similar items:', err);
        setError('Failed to load similar items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarItems();
  }, [itemId, itemType, limit]);

  if (isLoading) {
    return (
      <div className="similar-items py-6">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-44 h-64 bg-emby-surface animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !items.length) {
    return null;
  }

  return (
    <div className="similar-items py-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emby-surface scrollbar-track-transparent">
        {items.map((item) => (
          <div key={item.Id} className="flex-shrink-0 w-44">
            <MediaCard item={item} variant="portrait" />
          </div>
        ))}
      </div>
    </div>
  );
}