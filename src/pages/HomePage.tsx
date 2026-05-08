import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useContinueWatching, useRecentlyAdded } from '../hooks';
import { PageHeader, LoadingSpinner } from '../components/layout';
import { MediaCard, MediaCardSkeleton } from '../components/media';
import type { BaseItemDto } from '../api/types';

const CONTINUE_WATCHING_LIMIT = 10;
const RECENTLY_ADDED_LIMIT = 10;

interface MediaRowProps {
  title: string;
  items: BaseItemDto[];
  isLoading: boolean;
  viewAllLink?: string;
}

function MediaRow({ title, items, isLoading, viewAllLink }: MediaRowProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-sm text-emby-primary hover:text-emby-primary/80 transition-colors"
          >
            View all
          </a>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-64 flex-shrink-0">
              <MediaCardSkeleton variant="backdrop" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-emby-text-secondary py-4">No items</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.slice(0, CONTINUE_WATCHING_LIMIT).map((item) => (
            <div key={item.Id} className="w-64 flex-shrink-0">
              <MediaCard item={item} variant="backdrop" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const {
    items: continueWatchingItems,
    isLoading: isContinueWatchingLoading
  } = useContinueWatching(user?.Id ?? '');

  const {
    items: recentlyAddedItems,
    isLoading: isRecentlyAddedLoading
  } = useRecentlyAdded(user?.Id ?? '', RECENTLY_ADDED_LIMIT);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const isLoading = isContinueWatchingLoading || isRecentlyAddedLoading;

  return (
    <div className="p-6">
      <PageHeader
        title={`Welcome${user?.Name ? `, ${user.Name}` : ''}`}
        subtitle="Continue watching or browse your library"
      />

      {isLoading ? (
        <div className="mt-8">
          <MediaRow
            title="Continue Watching"
            items={[]}
            isLoading={true}
          />
          <MediaRow
            title="Recently Added"
            items={[]}
            isLoading={true}
          />
        </div>
      ) : (
        <>
          <div className="mt-8">
            <MediaRow
              title="Continue Watching"
              items={continueWatchingItems}
              isLoading={isContinueWatchingLoading}
              viewAllLink="/continue-watching"
            />
          </div>

          <div className="mt-8">
            <MediaRow
              title="Recently Added"
              items={recentlyAddedItems}
              isLoading={isRecentlyAddedLoading}
              viewAllLink="/recently-added"
            />
          </div>
        </>
      )}
    </div>
  );
}