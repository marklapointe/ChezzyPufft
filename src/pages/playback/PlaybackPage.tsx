import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { UserItemData } from '../../api/types';
import { getApiClient } from '../../api/client';
import { useItem } from '../../hooks/useItem';
import { usePlaybackControls } from './usePlaybackControls';
import { AudioVideoPlayer } from './AudioVideoPlayer';

interface PlaybackPageProps {
  itemId?: string;
}

export function PlaybackPage({ itemId: propItemId }: PlaybackPageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const itemId = propItemId || params.id;

  const { item, isLoading: isItemLoading, error: itemError, refresh: refreshItem } = useItem(itemId || '');
  const [initialPosition, setInitialPosition] = useState(0);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);

  useEffect(() => {
    const fetchPlaybackPosition = async () => {
      if (!itemId) return;

      setIsLoadingPosition(true);
      try {
        const client = getApiClient();
        const userData = await client.request<UserItemData>(
          `/Items/${itemId}/UserData`
        );
        if (userData?.PlaybackPositionTicks) {
          setInitialPosition(userData.PlaybackPositionTicks);
        }
      } catch (err) {
        console.error('Failed to fetch playback position:', err);
      } finally {
        setIsLoadingPosition(false);
      }
    };

    fetchPlaybackPosition();
  }, [itemId]);

  const handlePlaybackStatusChange = useCallback((status: string) => {
    console.log('Playback status:', status);
  }, []);

  const handlePositionChange = useCallback((_position: number) => {
  }, []);

  const handlePlaybackEnded = useCallback(() => {
    console.log('Playback ended');
  }, []);

  const playbackControls = usePlaybackControls({
    item,
    startPosition: initialPosition,
    onStatusChange: handlePlaybackStatusChange,
    onPositionChange: handlePositionChange,
    onEnded: handlePlaybackEnded
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playbackControls.isPlaying && playbackControls.currentTime > 0) {
        const positionTicks = Math.floor(playbackControls.currentTime * 10000000);
        navigator.sendBeacon?.(
          `/api/Videos/${item?.Id}/Progress`,
          JSON.stringify({
            itemId: item?.Id,
            positionTicks,
            isPaused: true
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [item?.Id, playbackControls.isPlaying, playbackControls.currentTime]);

  const handleGoBack = useCallback(() => {
    if (item) {
      if (item.Type === 'Episode' && item.SeriesId) {
        navigate(`/series/${item.SeriesId}`);
      } else if (item.Type === 'Season' && item.SeriesId) {
        navigate(`/series/${item.SeriesId}`);
      } else {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [item, navigate]);

  if (isItemLoading || isLoadingPosition) {
    return (
      <div className="playback-page fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emby-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Loading media...</p>
        </div>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="playback-page fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-500">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h1 className="text-2xl font-bold text-white">Failed to load media</h1>
          <p className="text-emby-text-secondary">{itemError?.message || 'Item not found'}</p>
          <button
            onClick={() => refreshItem()}
            className="px-4 py-2 bg-emby-primary hover:bg-emby-secondary text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-emby-surface hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playback-page fixed inset-0 bg-black z-50">
      <AudioVideoPlayer
        item={item}
        playbackControls={playbackControls}
        startPosition={initialPosition}
        autoPlay={true}
      />
    </div>
  );
}
