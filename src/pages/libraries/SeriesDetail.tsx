import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { BaseItemDto, ItemsResult } from '../../api/types';
import { getApiClient } from '../../api/client';
import { BackdropImage } from '../../components/media/BackdropImage';
import { RatingBadge } from '../../components/media/RatingBadge';
import { UnplayedBadge } from '../../components/media/UnplayedBadge';

interface SeriesDetailProps {
  seriesId?: string;
}

interface SeasonWithUnwatched extends BaseItemDto {
  unplayedCount?: number;
}

function formatRuntime(ticks?: number): string | undefined {
  if (!ticks) return undefined;
  const minutes = Math.floor(ticks / 600000000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function SeriesDetail({ seriesId: propSeriesId }: SeriesDetailProps) {
  const params = useParams();
  const navigate = useNavigate();
  const seriesId = propSeriesId || params.id;

  const [series, setSeries] = useState<BaseItemDto | null>(null);
  const [seasons, setSeasons] = useState<SeasonWithUnwatched[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      if (!seriesId) return;

      setIsLoading(true);
      setError(null);

      try {
        const client = getApiClient();

        const seriesResponse = await client.request<BaseItemDto>(
          `/Items/${seriesId}?Fields=PrimaryImageAspectRatio,CommunityRating,Genres`
        );
        setSeries(seriesResponse);

        const seasonsResponse = await client.request<ItemsResult>(
          `/Items/${seriesId}/Seasons?Fields=PrimaryImageAspectRatio,ChildCount`
        );
        setSeasons(seasonsResponse.Items as SeasonWithUnwatched[]);
      } catch (err) {
        console.error('Failed to fetch series data:', err);
        setError('Failed to load series details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesId]);

  if (isLoading) {
    return (
      <div className="series-detail p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-emby-surface rounded-lg mb-6" />
          <div className="h-8 w-48 bg-emby-surface rounded mb-4" />
          <div className="h-4 w-96 bg-emby-surface rounded mb-2" />
          <div className="h-4 w-80 bg-emby-surface rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-emby-surface rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="series-detail p-6">
        <div className="text-emby-text-secondary">{error || 'Series not found'}</div>
      </div>
    );
  }

  const backdropSrc = series.ImageTags?.Backdrop
    ? `/api/items/${series.Id}/Images/Backdrop?tag=${series.ImageTags.Backdrop}`
    : series.BackdropImageTags?.[0]
    ? `/api/items/${series.Id}/Images/Backdrop?tag=${series.BackdropImageTags[0]}`
    : undefined;

  const posterSrc = series.ImageTags?.Primary
    ? `/api/items/${series.Id}/Images/Primary?tag=${series.ImageTags.Primary}`
    : undefined;

  return (
    <div className="series-detail">
      <div className="relative h-80 mb-6">
        <BackdropImage src={backdropSrc} alt={series.Name || 'Series'} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex gap-6">
            {posterSrc && (
              <img
                src={posterSrc}
                alt={series.Name}
                className="h-56 w-40 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="flex flex-col justify-end">
              <h1 className="text-4xl font-bold text-white mb-2">{series.Name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-emby-text-secondary mb-3">
                {series.ProductionYear && <span>{series.ProductionYear}</span>}
                {series.RunTimeTicks && (
                  <span>{formatRuntime(series.RunTimeTicks)}</span>
                )}
                {series.Genres && series.Genres.length > 0 && (
                  <span>{series.Genres.slice(0, 3).join(', ')}</span>
                )}
                {series.CommunityRating && (
                  <RatingBadge rating={series.CommunityRating} />
                )}
              </div>
              {series.Status && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-emby-primary/30 text-emby-primary rounded">
                  {series.Status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {series.Overview && (
        <div className="px-6 mb-6">
          <p className="text-emby-text-secondary leading-relaxed max-w-4xl">
            {series.Overview}
          </p>
        </div>
      )}

      <div className="seasons-section px-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Seasons ({seasons.length})
        </h2>

        {seasons.length === 0 ? (
          <div className="text-emby-text-secondary py-8 text-center">
            No seasons found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seasons.map((season) => {
              const seasonPosterSrc = season.ImageTags?.Primary
                ? `/api/items/${season.Id}/Images/Primary?tag=${season.ImageTags.Primary}`
                : undefined;

              return (
                <div
                  key={season.Id}
                  className="season-card group cursor-pointer"
                  onClick={() => navigate(`/season/${season.Id}`)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-emby-surface mb-2 transition-transform duration-200 group-hover:scale-105">
                    {seasonPosterSrc ? (
                      <img
                        src={seasonPosterSrc}
                        alt={season.Name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-emby-surface">
                        <span className="text-2xl font-bold text-emby-text-secondary">
                          {season.Name?.charAt(0) || 'S'}
                        </span>
                      </div>
                    )}
                    {season.unplayedCount && season.unplayedCount > 0 && (
                      <div className="absolute top-2 right-2">
                        <UnplayedBadge count={season.unplayedCount} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">
                    {season.Name || `Season ${season.IndexNumber}`}
                  </h3>
                  <p className="text-xs text-emby-text-secondary">
                    {season.ChildCount || 0} episodes
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}