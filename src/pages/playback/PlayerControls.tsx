import { useState, useRef, useCallback } from 'react';
import type { PlaybackStatus } from './usePlaybackControls';
import { PLAYBACK_SPEEDS } from './usePlaybackControls';

interface PlayerControlsProps {
  status: PlaybackStatus;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSetPlaybackSpeed: (speed: number) => void;
  onTogglePiP?: () => void;
  showSpeedMenu?: boolean;
  onCloseSpeedMenu?: () => void;
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

function formatVolume(volume: number): string {
  return `${Math.round(volume * 100)}%`;
}

export function PlayerControls({
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  buffered,
  volume,
  isMuted,
  isFullscreen,
  playbackSpeed,
  onTogglePlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSetPlaybackSpeed,
  onTogglePiP,
  showSpeedMenu = false,
  onCloseSpeedMenu
}: PlayerControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(Math.max(0, Math.min(duration, newTime)));
  }, [duration, onSeek]);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, percent)));
  }, [onVolumeChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    let hasDragged = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (moveEvent.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      if (Math.abs(moveEvent.clientX - startX) > 5) {
        hasDragged = true;
      }
      onSeek(Math.max(0, Math.min(duration, newTime)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (!hasDragged) {
        handleProgressClick(e);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [currentTime, duration, onSeek, handleProgressClick]);

  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300"
      role="group"
      aria-label="Media playback controls"
    >
      <div
        ref={progressRef}
        className="group/progress relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-4 hover:h-2 transition-all"
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        tabIndex={0}
      >
        <div
          className="absolute inset-y-0 left-0 bg-emby-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
          style={{ width: `${bufferedProgress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emby-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlayPause}
          className="flex items-center justify-center w-10 h-10 text-white hover:text-emby-primary transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isBuffering}
        >
          {isBuffering ? (
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-1 text-sm text-emby-text-secondary font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div
          ref={volumeRef}
          className="relative flex items-center gap-2 group/volume"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={onToggleMute}
            className="flex items-center justify-center w-8 h-8 text-white hover:text-emby-primary transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          <div
            className={`w-0 overflow-hidden transition-all duration-200 ${
              showVolumeSlider || isMuted ? 'w-20' : 'w-0'
            }`}
          >
            <div
              className="h-1 bg-white/20 rounded-full cursor-pointer"
              onClick={handleVolumeClick}
            >
              <div
                className="h-full bg-emby-primary rounded-full relative"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emby-primary rounded-full" />
              </div>
            </div>
          </div>

          <span className="text-xs text-emby-text-secondary w-8">
            {formatVolume(isMuted ? 0 : volume)}
          </span>
        </div>

        <div className="flex-1" />

        <div className="relative">
          <button
            onClick={onTogglePiP}
            className="flex items-center justify-center w-8 h-8 text-white hover:text-emby-primary transition-colors"
            aria-label="Picture in picture"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              if (showSpeedMenu && onCloseSpeedMenu) {
                onCloseSpeedMenu();
              } else {
                const nextIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed) + 1;
                const nextSpeed = PLAYBACK_SPEEDS[nextIndex] || PLAYBACK_SPEEDS[0];
                onSetPlaybackSpeed(nextSpeed);
              }
            }}
            className="flex items-center justify-center px-2 h-8 text-sm text-white hover:text-emby-primary transition-colors font-mono"
            aria-label={`Playback speed ${playbackSpeed}x`}
          >
            {playbackSpeed}x
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-emby-surface rounded-lg shadow-lg overflow-hidden">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSetPlaybackSpeed(speed)}
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                    speed === playbackSpeed ? 'text-emby-primary' : 'text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onToggleFullscreen}
          className="flex items-center justify-center w-8 h-8 text-white hover:text-emby-primary transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
