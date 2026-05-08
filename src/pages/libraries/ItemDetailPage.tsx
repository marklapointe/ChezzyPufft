import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { BaseItemDto, BaseItemPerson } from '../../api/types';
import { getApiClient } from '../../api/client';
import { BackdropImage } from '../../components/media/BackdropImage';
import { PlayButton } from '../../components/media/PlayButton';
import { RatingBadge } from '../../components/media/RatingBadge';
import { CastCarousel } from './CastCarousel';
import { SimilarItems } from './SimilarItems';

interface ItemDetailPageProps {
  itemId?: string;
}

function formatRuntime(ticks?: number): string | undefined {
  if (!ticks) return undefined;
  const minutes = Math.floor(ticks / 600000000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function getItemTypeLabel(type?: string): string {
  const labels: Partial<Record<string, string>> = {
    Movie: 'Movie',
    Series: 'Series',
    Season: 'Season',
    Episode: 'Episode',
    MusicAlbum: 'Album',
    MusicArtist: 'Artist',
    Audio: 'Track',
    Video: 'Video',
    BoxSet: 'Collection',
    Playlist: 'Playlist'
  };
  if (!type || !labels[type]) return type || '';
  return labels[type];
}

export function ItemDetailPage({ itemId: propItemId }: ItemDetailPageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const itemId = propItemId || params.id;

  const [item, setItem] = useState<BaseItemDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;

      setIsLoading(true);
      setError(null);

      try {
        const client = getApiClient();
        const response = await client.request<BaseItemDto>(
          `/Items/${itemId}?Fields=PrimaryImageAspectRatio,CommunityRating,Genres,Cast,Crew,Overview,RunTimeTicks`
        );
        setItem(response);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handlePlay = () => {
    if (item) {
      navigate(`/playback/${item.Id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="item-detail-page">
        <div className="animate-pulse">
          <div className="h-96 bg-emby-surface" />
          <div className="px-6 py-8">
            <div className="h-10 w-64 bg-emby-surface rounded mb-4" />
            <div className="h-4 w-96 bg-emby-surface rounded mb-2" />
            <div className="h-4 w-80 bg-emby-surface rounded mb-6" />
            <div className="h-32 w-full max-w-3xl bg-emby-surface rounded mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-page p-6">
        <div className="text-emby-text-secondary">{error || 'Item not found'}</div>
      </div>
    );
  }

  const backdropSrc = item.ImageTags?.Backdrop
    ? `/api/items/${item.Id}/Images/Backdrop?tag=${item.ImageTags.Backdrop}`
    : item.BackdropImageTags?.[0]
    ? `/api/items/${item.Id}/Images/Backdrop?tag=${item.BackdropImageTags[0]}`
    : item.backdrop?.[0]
    ? item.backdrop[0]
    : undefined;

  const posterSrc = item.ImageTags?.Primary
    ? `/api/items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`
    : undefined;

  const cast = item.Cast ?? [];
  const crew = item.Crew ?? [];
  const castAndCrew: BaseItemPerson[] = [...(cast || []), ...(crew || [])];

  const itemTypeLabel = getItemTypeLabel(item.Type);

  return (
    <div className="item-detail-page">
      <div className="relative h-96">
        <BackdropImage src={backdropSrc} alt={item.Name || ''} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-8">
            <div className="flex gap-6 items-end">
              {posterSrc && (
                <img
                  src={posterSrc}
                  alt={item.Name}
                  className="hidden md:block h-72 w-48 object-cover rounded-lg shadow-2xl flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-emby-primary/30 text-emby-primary rounded">
                    {itemTypeLabel}
                  </span>
                  {item.ProductionYear && (
                    <span className="text-emby-text-secondary">{item.ProductionYear}</span>
                  )}
                  {item.RunTimeTicks && (
                    <span className="text-emby-text-secondary">
                      {formatRuntime(item.RunTimeTicks)}
                    </span>
                  )}
                  {item.CommunityRating && (
                    <RatingBadge rating={item.CommunityRating} />
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {item.Name}
                </h1>
                {item.Genres && item.Genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.Genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 text-xs bg-emby-surface/50 text-emby-text-secondary rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <PlayButton item={item} variant="filled" size="lg" onPlay={handlePlay} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {item.Overview && (
          <div className="mb-8 max-w-4xl">
            <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
            <p className="text-emby-text-secondary leading-relaxed whitespace-pre-line">
              {item.Overview}
            </p>
          </div>
        )}

        {item.Type === 'Series' && (
          <div className="mb-8">
            <button
              onClick={() => navigate(`/series/${item.Id}`)}
              className="px-4 py-2 bg-emby-surface hover:bg-emby-surface/80 text-white rounded-lg transition-colors"
            >
              View Seasons
            </button>
          </div>
        )}

        {item.Type === 'Season' && (
          <div className="mb-8">
            <button
              onClick={() => navigate(`/season/${item.Id}`)}
              className="px-4 py-2 bg-emby-surface hover:bg-emby-surface/80 text-white rounded-lg transition-colors"
            >
              View Episodes
            </button>
          </div>
        )}

        {castAndCrew.length > 0 && (
          <CastCarousel people={castAndCrew} title="Cast & Crew" />
        )}

        <SimilarItems itemId={item.Id} limit={12} />
      </div>
    </div>
  );
}