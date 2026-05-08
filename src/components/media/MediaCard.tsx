import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseItemDto, ItemType, UserItemData } from '../../api/types';
import { ProgressBar } from './ProgressBar';
import { UnplayedBadge } from './UnplayedBadge';
import { RatingBadge } from './RatingBadge';

export type MediaCardVariant = 'default' | 'portrait' | 'square' | 'backdrop';

interface MediaCardProps {
  item: BaseItemDto;
  userData?: UserItemData;
  variant?: MediaCardVariant;
  unplayedCount?: number;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
}

const ITEM_TYPE_LABELS: Partial<Record<ItemType, string>> = {
  Movie: 'Movie',
  Series: 'Series',
  Episode: 'Episode',
  MusicAlbum: 'Album',
  MusicArtist: 'Artist',
  Audio: 'Track',
  Book: 'Book',
  Folder: 'Folder',
  Playlist: 'Playlist',
  BoxSet: 'Collection'
};

function formatYear(premiereDate?: string, productionYear?: number): string | undefined {
  if (premiereDate) {
    return new Date(premiereDate).getFullYear().toString();
  }
  if (productionYear) {
    return productionYear.toString();
  }
  return undefined;
}

function formatRuntime(ticks?: number): string | undefined {
  if (!ticks) return undefined;
  const minutes = Math.floor(ticks / 600000000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function getItemSubtitle(item: BaseItemDto): string {
  const parts: string[] = [];

  const year = formatYear(item.PremiereDate, item.ProductionYear);
  if (year) parts.push(year);

  const type = ITEM_TYPE_LABELS[item.Type];
  if (type) parts.push(type);

  const runtime = formatRuntime(item.RunTimeTicks || item.ActualRunTimeTicks);
  if (runtime) parts.push(runtime);

  if (item.IndexNumber !== undefined && item.ParentIndexNumber !== undefined) {
    parts.push(`S${item.ParentIndexNumber} E${item.IndexNumber}`);
  } else if (item.IndexNumber !== undefined) {
    parts.push(`Ep ${item.IndexNumber}`);
  }

  if (item.SeriesName && item.Type === 'Episode') {
    return item.SeriesName;
  }

  return parts.join(' • ');
}

function getImageSrc(item: BaseItemDto): string | undefined {
  if (item.ImageTags?.Primary) {
    return item.PrimaryImageItemId
      ? `/api/items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`
      : `/api/items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`;
  }
  return undefined;
}

const VARIANT_DIMENSIONS: Record<MediaCardVariant, { aspect: string; textSize: string }> = {
  default: { aspect: 'aspect-[2/3]', textSize: 'text-sm' },
  portrait: { aspect: 'aspect-[2/3]', textSize: 'text-sm' },
  square: { aspect: 'aspect-square', textSize: 'text-sm' },
  backdrop: { aspect: 'aspect-video', textSize: 'text-lg' }
};

export function MediaCard({
  item,
  userData,
  variant = 'default',
  unplayedCount,
  onContextMenu
}: MediaCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const { aspect, textSize } = VARIANT_DIMENSIONS[variant];

  const handleClick = () => {
    if (item.Type === 'Series' || item.Type === 'Season') {
      navigate(`/series/${item.Id}`);
    } else if (item.Type === 'Episode') {
      navigate(`/series/${item.SeriesId}/episode/${item.Id}`);
    } else {
      navigate(`/item/${item.Id}`);
    }
  };

  const hasProgress = userData && userData.PlaybackPositionTicks && item.RunTimeTicks;
  const progressPercent = hasProgress
    ? (userData!.PlaybackPositionTicks! / item.RunTimeTicks!) * 100
    : 0;

  const imageSrc = getImageSrc(item);
  const showPlaceholder = !imageSrc || imageError;

  return (
    <div
      className={`media-card group relative cursor-pointer overflow-hidden rounded-lg bg-emby-surface transition-all duration-200 hover:scale-105 hover:shadow-lg ${aspect}`}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="absolute inset-0">
        {showPlaceholder ? (
          <div className="flex h-full w-full items-center justify-center bg-emby-surface">
            <span className="text-4xl font-bold text-emby-text-secondary">
              {item.Name.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={item.Name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {variant === 'backdrop' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        )}
      </div>

      {hasProgress && progressPercent > 0 && progressPercent < 100 && (
        <div className="absolute bottom-0 left-0 right-0">
          <ProgressBar progress={progressPercent} duration={item.RunTimeTicks!} currentPosition={userData!.PlaybackPositionTicks!} />
        </div>
      )}

      {unplayedCount !== undefined && unplayedCount > 0 && (
        <div className="absolute top-2 right-2">
          <UnplayedBadge count={unplayedCount} />
        </div>
      )}

      {item.CommunityRating && (
        <div className="absolute bottom-2 right-2">
          <RatingBadge rating={item.CommunityRating} />
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 ${
          variant === 'backdrop' ? '' : 'pt-8'
        }`}
      >
        <h3 className={`font-semibold text-white line-clamp-2 ${textSize}`}>{item.Name}</h3>
        <p className="mt-1 text-xs text-emby-text-secondary">{getItemSubtitle(item)}</p>
      </div>
    </div>
  );
}