import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { BaseItemDto, ItemsResult } from '../../api/types';
import { getApiClient } from '../../api/client';
import { BackdropImage } from '../../components/media/BackdropImage';
import { PlayButton } from '../../components/media/PlayButton';
import { RatingBadge } from '../../components/media/RatingBadge';

interface SeasonDetailProps {
  seasonId?: string;
}

function formatRuntime(ticks?: number): string | undefined {
  if (!ticks) return undefined;
  const minutes = Math.floor(ticks / 600000000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function SeasonDetail({ seasonId: propSeasonId }: SeasonDetailProps) {
  const params = useParams();
  const navigate = useNavigate();
  const seasonId = propSeasonId || params.id;

  const [season, setSeason] = useState<BaseItemDto | null>(null);
  const [episodes, setEpisodes] = useState<BaseItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      if (!seasonId) return;

      setIsLoading(true);
      setError(null);

      try {
        const client = getApiClient();

        const seasonResponse = await client.request<BaseItemDto>(
          `/Items/${seasonId}`
        );
        setSeason(seasonResponse);

        const episodesResponse = await client.request<ItemsResult>(
          `/Items/${seasonId}/Items?Fields=PrimaryImageAspectRatio,CommunityRating,RunTimeTicks`
        );
        setEpisodes(episodesResponse.Items as BaseItemDto[]);
      } catch (err) {
        console.error('Failed to fetch season data:', err);
        setError('Failed to load season details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  if (isLoading) {
    return (
      <div className="season-detail p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-emby-surface rounded-lg mb-6" />
          <div className="h-8 w-48 bg-emby-surface rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-emby-surface rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="season-detail p-6">
        <div className="text-emby-text-secondary">{error || 'Season not found'}</div>
      </div>
    );
  }

  const backdropSrc = season.ImageTags?.Backdrop
    ? `/api/items/${season.Id}/Images/Backdrop?tag=${season.ImageTags.Backdrop}`
    : season.BackdropImageTags?.[0]
    ? `/api/items/${season.Id}/Images/Backdrop?tag=${season.BackdropImageTags[0]}`
    : undefined;

  const posterSrc = season.ImageTags?.Primary
    ? `/api/items/${season.Id}/Images/Primary?tag=${season.ImageTags.Primary}`
    : undefined;

  return (
    <div className="season-detail">
      <div className="relative h-64 mb-6">
        <BackdropImage src={backdropSrc} alt={season.Name || 'Season'} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex gap-6">
            {posterSrc && (
              <img
                src={posterSrc}
                alt={season.Name}
                className="h-48 w-32 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="flex flex-col justify-end">
              <h1 className="text-3xl font-bold text-white mb-2">{season.Name}</h1>
              {season.Overview && (
                <p className="text-emby-text-secondary line-clamp-2 max-w-2xl">{season.Overview}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="episodes-section px-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Episodes ({episodes.length})
        </h2>

        {episodes.length === 0 ? (
          <div className="text-emby-text-secondary py-8 text-center">
            No episodes found
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => {
              const episodeNumber = episode.IndexNumber;
              const episodeTitle = episode.Name;
              const episodeOverview = episode.Overview;
              const episodeRuntime = formatRuntime(episode.RunTimeTicks || episode.ActualRunTimeTicks);
              const episodeImageSrc = episode.ImageTags?.Primary
                ? `/api/items/${episode.Id}/Images/Primary?tag=${episode.ImageTags.Primary}`
                : undefined;

              return (
                <div
                  key={episode.Id}
                  className="episode-item flex gap-4 bg-emby-surface/50 rounded-lg p-4 hover:bg-emby-surface transition-colors cursor-pointer"
                  onClick={() => navigate(`/item/${episode.Id}`)}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-emby-primary/20 rounded-lg">
                    <span className="text-xl font-bold text-emby-primary">
                      {episodeNumber ?? '?'}
                    </span>
                  </div>

                  {episodeImageSrc ? (
                    <img
                      src={episodeImageSrc}
                      alt={episodeTitle}
                      className="flex-shrink-0 w-32 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="flex-shrink-0 w-32 h-20 bg-emby-surface rounded flex items-center justify-center">
                      <span className="text-emby-text-secondary">No Image</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium truncate">{episodeTitle}</h3>
                      {episode.CommunityRating && (
                        <RatingBadge rating={episode.CommunityRating} />
                      )}
                    </div>
                    <p className="text-xs text-emby-text-secondary mb-1">
                      {episode.PremiereDate && new Date(episode.PremiereDate).getFullYear()}
                      {episodeRuntime && ` • ${episodeRuntime}`}
                    </p>
                    {episodeOverview && (
                      <p className="text-sm text-emby-text-secondary line-clamp-2">
                        {episodeOverview}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    <PlayButton item={episode} size="md" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}