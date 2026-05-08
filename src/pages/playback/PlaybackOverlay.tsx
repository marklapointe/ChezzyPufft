import type { BaseItemDto } from '../../api/types';

interface ChapterInfo {
  name?: string;
  position: number;
  imageUrl?: string;
}

interface PlaybackOverlayProps {
  item: BaseItemDto | null;
  chapters?: ChapterInfo[];
  onClose?: () => void;
  isVisible: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlaybackOverlay({
  item,
  chapters = [],
  onClose,
  isVisible
}: PlaybackOverlayProps) {
  if (!item || !isVisible) return null;

  const isEpisode = item.Type === 'Episode';
  const isMovie = item.Type === 'Movie';

  const title = item.Name;
  const episodeTitle = isEpisode ? item.Name : null;
  const seriesName = item.SeriesName;
  const seasonNumber = item.ParentIndexNumber;
  const episodeNumber = item.IndexNumber;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      role="region"
      aria-label="Now playing information"
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors pointer-events-auto"
        aria-label="Close overlay"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {isMovie && item.ProductionYear && (
          <span className="px-3 py-1 bg-emby-primary/80 text-white text-sm rounded-full">
            {item.ProductionYear}
          </span>
        )}
        {item.CommunityRating && (
          <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {item.CommunityRating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="absolute bottom-24 left-4 right-4">
        <div className="mb-4">
          {seriesName && (
            <h2 className="text-lg text-emby-text-secondary font-medium">{seriesName}</h2>
          )}
          {isEpisode && seasonNumber && episodeNumber && (
            <h3 className="text-sm text-emby-text-secondary">
              Season {seasonNumber}, Episode {episodeNumber}
            </h3>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
            {episodeTitle || title}
          </h1>
        </div>

        {item.Overview && (
          <p className="text-sm text-emby-text-secondary line-clamp-2 max-w-2xl">
            {item.Overview}
          </p>
        )}
      </div>

      {chapters.length > 0 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-white/40 hover:bg-emby-primary transition-colors"
              aria-label={`Chapter: ${chapter.name || index + 1} at ${formatTime(chapter.position)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
