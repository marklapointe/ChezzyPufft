import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useContinueWatching, useRecentlyAdded, useLibraries } from '../hooks';
import { LoadingSpinner } from '../components/layout';
import { MediaCard, MediaCardSkeleton, ProgressBar } from '../components/media';
import type { BaseItemDto, SessionInfo } from '../api/types';
import { getApiClient } from '../api/client';
import { getWebSocket, WebSocketMessage } from '../api/websocket';

const CONTINUE_WATCHING_LIMIT = 10;
const RECENTLY_ADDED_LIMIT = 10;

function UserGreeting({ userName }: { userName?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const apiClient = getApiClient();
        await apiClient.getCurrentUser();
        setServerStatus('connected');
      } catch {
        setServerStatus('disconnected');
      }
    };

    checkServerConnection();
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statusColors = {
    connected: 'bg-green-500',
    disconnected: 'bg-red-500',
    checking: 'bg-yellow-500'
  };

  const statusLabels = {
    connected: 'Connected',
    disconnected: 'Disconnected',
    checking: 'Checking...'
  };

  return (
    <div className="rounded-xl bg-gradient-to-r from-emby-surface to-black/50 p-6 border border-white/5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-emby-text-secondary mt-1">
            {formatDate(currentTime)} at {formatTime(currentTime)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[serverStatus]} animate-pulse`} />
          <span className="text-sm text-emby-text-secondary">
            Server: {statusLabels[serverStatus]}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickAccessCards({ libraries, isLoading }: { libraries: BaseItemDto[]; isLoading: boolean }) {
  const navigate = useNavigate();

  const quickAccessItems = [
    {
      id: 'movies',
      label: 'Movies',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      count: 0,
      path: '/movies',
      typeFilter: 'Movie'
    },
    {
      id: 'tvshows',
      label: 'TV Shows',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      count: 0,
      path: '/tvshows',
      typeFilter: 'Series'
    },
    {
      id: 'music',
      label: 'Music',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      count: 0,
      path: '/music',
      typeFilter: 'MusicAlbum'
    },
    {
      id: 'livetv',
      label: 'Live TV',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-6.95-6.95a7 7 0 010-9.85zM18 9l3 3-3 3" />
        </svg>
      ),
      count: 0,
      path: '/livetv',
      typeFilter: 'LiveTvChannel'
    }
  ];

  const libraryCounts = libraries.reduce((acc, lib) => {
    if (lib.Type === 'Movie' || lib.Type === 'Series' || lib.Type === 'MusicAlbum' || lib.Type === 'LiveTvChannel') {
      acc[lib.Type] = (acc[lib.Type] || 0) + (lib.RecursiveItemCount || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  const items = quickAccessItems.map(item => ({
    ...item,
    count: libraryCounts[item.typeFilter] || item.count
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-emby-surface animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className="group relative overflow-hidden rounded-xl bg-emby-surface border border-white/5 p-5 transition-all duration-300 hover:border-emby-primary/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-emby-primary/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emby-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col items-start gap-3">
            <div className="text-emby-primary">{item.icon}</div>
            <div>
              <p className="font-semibold text-white text-left">{item.label}</p>
              <p className="text-sm text-emby-text-secondary">{item.count.toLocaleString()} items</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ActiveSessionsWidget({ userId: _userId }: { userId: string }) {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const apiClient = getApiClient();
      const allSessions = await apiClient.getSessions();
      const activeSessions = allSessions.filter(
        (s) => s.PlayState && (s.PlayState.IsPaused === false || s.PlayState.PositionTicks)
      );
      setSessions(activeSessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  useEffect(() => {
    const ws = getWebSocket();
    if (ws) {
      ws.onMessage((message: WebSocketMessage) => {
        if (message.MessageType === 'SessionsUpdated' || message.MessageType === 'Play' || message.MessageType === 'Pause' || message.MessageType === 'Stop') {
          fetchSessions();
        }
      });
    }
  }, [fetchSessions]);

  if (isLoading) {
    return (
      <div className="mb-8 rounded-xl bg-emby-surface p-4 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-3">Active Sessions</h2>
        <div className="flex gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="w-48 h-20 rounded-lg bg-black/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 rounded-xl bg-emby-surface p-4 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emby-primary animate-pulse" />
        Active Sessions
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {sessions.slice(0, 5).map((session) => (
          <div
            key={session.Id}
            className="flex-shrink-0 w-48 rounded-lg bg-black/30 p-3 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {session.DeviceName || session.Client || 'Unknown Device'}
              </span>
            </div>
            <p className="text-xs text-emby-text-secondary truncate">
              {session.UserName || 'Unknown User'}
            </p>
            {session.PlayState && session.PlayState.PositionTicks && (
              <p className="text-xs text-emby-text-secondary mt-1">
                {Math.floor(session.PlayState.PositionTicks / 600000000)}:
                {Math.floor((session.PlayState.PositionTicks % 600000000) / 10000000).toString().padStart(2, '0')} playing
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContinueWatchingSection({ items, isLoading }: { items: BaseItemDto[]; isLoading: boolean }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Continue Watching</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-72 flex-shrink-0">
              <MediaCardSkeleton variant="backdrop" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
        <button
          onClick={() => navigate('/continue-watching')}
          className="text-sm text-emby-primary hover:text-emby-primary/80 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.slice(0, CONTINUE_WATCHING_LIMIT).map((item) => {
          const userData = (item as unknown as { UserData?: { PlaybackPositionTicks?: number } }).UserData;
          const hasProgress = userData?.PlaybackPositionTicks && item.RunTimeTicks;
          const progressPercent = hasProgress
            ? (userData!.PlaybackPositionTicks! / item.RunTimeTicks!) * 100
            : 0;

          return (
            <div key={item.Id} className="w-72 flex-shrink-0 group">
              <MediaCard item={item} variant="backdrop" userData={userData} />
              {hasProgress && progressPercent > 0 && progressPercent < 100 && (
                <div className="mt-2 px-1">
                  <ProgressBar
                    progress={progressPercent}
                    duration={item.RunTimeTicks!}
                    currentPosition={userData!.PlaybackPositionTicks!}
                    height="sm"
                  />
                  <p className="text-xs text-emby-text-secondary mt-1">
                    {Math.round(100 - progressPercent)}% remaining
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateAdded(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RecentlyAddedSection({ items, isLoading }: { items: BaseItemDto[]; isLoading: boolean }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recently Added</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-64 flex-shrink-0">
              <MediaCardSkeleton variant="portrait" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recently Added</h2>
        <p className="text-emby-text-secondary py-4">No recently added items</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Recently Added</h2>
        <button
          onClick={() => navigate('/recently-added')}
          className="text-sm text-emby-primary hover:text-emby-primary/80 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.slice(0, RECENTLY_ADDED_LIMIT).map((item) => (
          <div key={item.Id} className="w-56 flex-shrink-0 group">
            <MediaCard item={item} variant="portrait" />
            <div className="mt-2 px-1">
              <p className="text-xs text-emby-text-secondary">
                Added {formatDateAdded(item.DateCreated)}
              </p>
            </div>
          </div>
        ))}
      </div>
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

  const { libraries, isLoading: isLibrariesLoading } = useLibraries();

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
    <div className="p-4 md:p-6 min-h-screen bg-black">
      <UserGreeting userName={user?.Name} />
      <QuickAccessCards libraries={libraries} isLoading={isLibrariesLoading} />
      {user?.Id && <ActiveSessionsWidget userId={user.Id} />}

      {isLoading ? (
        <div className="space-y-8">
          <ContinueWatchingSection items={[]} isLoading={true} />
          <RecentlyAddedSection items={[]} isLoading={true} />
        </div>
      ) : (
        <>
          <ContinueWatchingSection
            items={continueWatchingItems}
            isLoading={isContinueWatchingLoading}
          />
          <RecentlyAddedSection
            items={recentlyAddedItems}
            isLoading={isRecentlyAddedLoading}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
