import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLibraryItems } from '../hooks';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/layout';
import { PlayButton } from '../components/media';

export function LiveTVPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const { items, isLoading, error } = useLibraryItems(
    user?.Id ?? null,
    {
      types: ['LiveTvChannel'],
      sortBy: ['SortName'],
      sortOrder: 'Ascending',
      limit: 100
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const handlePlayChannel = (channelId: string) => {
    navigate(`/live-tv/play/${channelId}`);
  };

  return (
    <div className="p-6">
      <PageHeader title="Live TV" />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading channels"
          message={error.message}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No live TV channels"
          message="No live TV channels are configured."
        />
      ) : (
        <div className="mt-6 space-y-2">
          {items.map((channel) => (
            <div
              key={channel.Id}
              className="flex items-center gap-4 rounded-lg bg-emby-surface p-4 transition-colors hover:bg-emby-surface/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emby-primary/20 text-2xl font-bold text-emby-primary">
                {(channel as any).ChannelNumber || channel.Name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-lg font-semibold text-white">
                  {channel.Name}
                </h3>
                {(channel as any).ChannelNumber && (
                  <p className="text-sm text-emby-text-secondary">
                    Channel {(channel as any).ChannelNumber}
                  </p>
                )}
              </div>
              <PlayButton
                item={channel}
                variant="icon-text"
                onPlay={() => handlePlayChannel(channel.Id)}
                size="md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}