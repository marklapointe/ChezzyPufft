import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BaseItemDto, MediaStream } from '../../api/types';
import type { PlaybackControlsResult } from './usePlaybackControls';
import { PlayerControls } from './PlayerControls';
import { PlaybackOverlay } from './PlaybackOverlay';

interface AudioVideoPlayerProps {
  item: BaseItemDto | null;
  playbackControls: PlaybackControlsResult;
  startPosition?: number;
  autoPlay?: boolean;
}

interface TrackMenuProps {
  streams: MediaStream[];
  currentStream: MediaStream | null;
  onSelect: (stream: MediaStream) => void;
  label: string;
}

function TrackMenu({ streams, currentStream, onSelect, label }: TrackMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm text-white hover:text-emby-primary transition-colors"
      >
        <span>{label}</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 min-w-48 max-h-64 overflow-y-auto bg-emby-surface rounded-lg shadow-lg">
          <div className="p-2">
            <button
              onClick={() => {
                onSelect(streams[0]);
                setIsOpen(false);
              }}
              className="block w-full px-3 py-2 text-sm text-left hover:bg-white/10 rounded transition-colors text-emby-text-secondary"
            >
              Off
            </button>
            {streams.map((stream, index) => {
              const isActive = currentStream?.Index === stream.Index;
              const displayTitle = (stream as Record<string, unknown>).DisplayTitle as string | undefined;
              const displayName: string = stream.Language
                ? `${stream.Language.toUpperCase()}${displayTitle ? ` - ${displayTitle}` : ''}`
                : displayTitle || `Track ${index + 1}`;
              return (
                <button
                  key={stream.Index}
                  onClick={() => {
                    onSelect(stream);
                    setIsOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-sm text-left hover:bg-white/10 rounded transition-colors ${
                    isActive ? 'text-emby-primary' : 'text-white'
                  }`}
                >
                  {displayName}
                  {stream.IsDefault && (
                    <span className="ml-2 text-xs text-emby-text-secondary">(Default)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AudioVideoPlayer({
  item,
  playbackControls,
  autoPlay = true
}: AudioVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [showTrackMenus, setShowTrackMenus] = useState(false);
  const hideControlsTimeout = useRef<number | null>(null);

  const {
    status,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isFullscreen,
    playbackSpeed,
    audioStreams,
    subtitleStreams,
    currentAudioStream,
    currentSubtitleStream,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    toggleFullscreen,
    setAudioStream,
    setSubtitleStream,
    videoRef,
    getPlaybackUrl
  } = playbackControls;

  const playbackUrl = getPlaybackUrl();

  const resetHideControlsTimer = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideControlsTimeout.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    resetHideControlsTimer();
  }, [isPlaying, resetHideControlsTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playbackUrl) return;

    video.src = playbackUrl;
    if (autoPlay) {
      video.play().catch(console.error);
    }
  }, [playbackUrl, autoPlay, videoRef]);

  const handleContainerClick = useCallback(() => {
    resetHideControlsTimer();
    if (!showControls) {
      setShowControls(true);
    } else {
      togglePlayPause();
    }
  }, [resetHideControlsTimer, showControls, togglePlayPause]);

  const handleMouseMove = useCallback(() => {
    resetHideControlsTimer();
  }, [resetHideControlsTimer]);

  const handlePiP = useCallback(async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP error:', err);
      }
    }
  }, [videoRef]);

  if (!item) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <p className="text-emby-text-secondary">No media item selected</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        className="w-full h-full object-contain"
        onClick={handleContainerClick}
        playsInline
        autoPlay={autoPlay}
        aria-label={`Video player for ${item.Name}`}
      >
        {item.MediaStreams?.filter((s): s is MediaStream => s.Type === 'Subtitle' && !!s.IsExternal).map((subtitle) => (
          <track
            key={subtitle.Index}
            kind="subtitles"
            src={subtitle.Path}
            srcLang={subtitle.Language ?? 'en'}
            label={((subtitle as Record<string, unknown>).DisplayTitle as string) ?? subtitle.Language ?? 'Subtitles'}
            default={subtitle.IsDefault ?? false}
          />
        ))}
      </video>

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleContainerClick}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {status === 'buffering' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-emby-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-500 mb-4">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-white text-lg">Playback error occurred</p>
          <p className="text-emby-text-secondary text-sm mt-2">Please try again</p>
        </div>
      )}

      <PlayerControls
        status={status}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        volume={volume}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        playbackSpeed={playbackSpeed}
        onPlay={() => videoRef.current?.play()}
        onPause={() => videoRef.current?.pause()}
        onTogglePlayPause={togglePlayPause}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onSetPlaybackSpeed={setPlaybackSpeed}
        onTogglePiP={handlePiP}
        showSpeedMenu={showTrackMenus}
        onCloseSpeedMenu={() => setShowTrackMenus(false)}
      />

      <div
        className={`absolute bottom-16 right-4 flex gap-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {audioStreams.length > 1 && (
          <TrackMenu
            streams={audioStreams}
            currentStream={currentAudioStream}
            onSelect={setAudioStream}
            label="Audio"
          />
        )}
        {subtitleStreams.length > 0 && (
          <TrackMenu
            streams={subtitleStreams}
            currentStream={currentSubtitleStream}
            onSelect={setSubtitleStream}
            label="Subtitles"
          />
        )}
      </div>

      <PlaybackOverlay
        item={item}
        isVisible={!showControls && isPlaying}
      />
    </div>
  );
}
