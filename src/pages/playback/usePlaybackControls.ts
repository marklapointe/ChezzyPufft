import { useState, useEffect, useCallback, useRef } from 'react';
import { getApiClient } from '../../api/client';
import type { BaseItemDto, MediaStream } from '../../api/types';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';

interface PlaybackControlsOptions {
  item: BaseItemDto | null;
  startPosition?: number;
  onStatusChange?: (status: PlaybackStatus) => void;
  onPositionChange?: (position: number) => void;
  onEnded?: () => void;
}

export interface PlaybackControlsResult {
  status: PlaybackStatus;
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  error: Error | null;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackSpeed: number;
  videoStreams: MediaStream[];
  audioStreams: MediaStream[];
  subtitleStreams: MediaStream[];
  currentVideoStream: MediaStream | null;
  currentAudioStream: MediaStream | null;
  currentSubtitleStream: MediaStream | null;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleFullscreen: () => void;
  setAudioStream: (stream: MediaStream) => void;
  setSubtitleStream: (stream: MediaStream | null) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  getPlaybackUrl: () => string | null;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function usePlaybackControls({
  item,
  startPosition = 0,
  onStatusChange,
  onPositionChange,
  onEnded
}: PlaybackControlsOptions): PlaybackControlsResult {
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
  const [audioStreams, setAudioStreams] = useState<MediaStream[]>([]);
  const [subtitleStreams, setSubtitleStreams] = useState<MediaStream[]>([]);
  const [currentVideoStream, setCurrentVideoStream] = useState<MediaStream | null>(null);
  const [currentAudioStream, setCurrentAudioStream] = useState<MediaStream | null>(null);
  const [currentSubtitleStream, setCurrentSubtitleStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const positionUpdateInterval = useRef<number | null>(null);

  const getPlaybackUrl = useCallback((): string | null => {
    if (!item?.Id) return null;
    const client = getApiClient();
    return `${client['serverUrl']}/emby/Videos/${item.Id}/stream?static=true&mediaSourceId=${item.Id}`;
  }, [item?.Id]);

  useEffect(() => {
    if (!item?.MediaStreams) {
      setVideoStreams([]);
      setAudioStreams([]);
      setSubtitleStreams([]);
      return;
    }

    const videos = item.MediaStreams.filter((s): s is MediaStream => s.Type === 'Video');
    const audios = item.MediaStreams.filter((s): s is MediaStream => s.Type === 'Audio');
    const subtitles = item.MediaStreams.filter((s): s is MediaStream => s.Type === 'Subtitle');

    setVideoStreams(videos);
    setAudioStreams(audios);
    setSubtitleStreams(subtitles);
    setCurrentVideoStream(videos.find((s) => s.IsDefault) || videos[0] || null);
    setCurrentAudioStream(audios.find((s) => s.IsDefault) || audios[0] || null);
    setCurrentSubtitleStream(subtitles.find((s) => s.IsDefault) || null);
  }, [item?.MediaStreams]);

  const updateStatus = useCallback((newStatus: PlaybackStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const reportPosition = useCallback(async (positionTicks: number) => {
    if (!item?.Id) return;
    try {
      const client = getApiClient();
      await client.request(`/Videos/${item.Id}/Progress`, {
        method: 'POST',
        body: JSON.stringify({
          itemId: item.Id,
          positionTicks,
          isPaused: status === 'paused'
        })
      });
    } catch (err) {
      console.error('Failed to report playback position:', err);
    }
  }, [item?.Id, status]);

  const play = useCallback(() => {
    videoRef.current?.play().catch(console.error);
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume;
    }
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (videoRef.current) {
        videoRef.current.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    if (!PLAYBACK_SPEEDS.includes(speed)) return;
    setPlaybackSpeedState(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const setAudioStream = useCallback((stream: MediaStream) => {
    setCurrentAudioStream(stream);
    if (videoRef.current && stream.Index !== undefined) {
      const video = videoRef.current as HTMLVideoElement & { audioTracks: { length: number; [index: number]: { enabled: boolean } } };
      if (video.audioTracks && video.audioTracks.length > stream.Index) {
        video.audioTracks[stream.Index].enabled = true;
      }
    }
  }, []);

  const setSubtitleStream = useCallback((stream: MediaStream | null) => {
    setCurrentSubtitleStream(stream);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 10));
          break;
        case 'arrowright':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 10));
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(volume - 0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          e.preventDefault();
          seek(duration * (parseInt(e.key) / 10));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, currentTime, duration, volume, seek, setVolume, toggleMute, toggleFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => updateStatus('playing');
    const handlePause = () => {
      updateStatus('paused');
      reportPosition(Math.floor(video.currentTime * 10000000));
    };
    const handleWaiting = () => updateStatus('buffering');
    const handleCanPlay = () => updateStatus('playing');
    const handleEnded = () => {
      updateStatus('idle');
      reportPosition(0);
      onEnded?.();
    };
    const handleError = () => {
      setError(new Error('Video playback error'));
      updateStatus('error');
    };
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onPositionChange?.(video.currentTime);
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const handleVolumeChange = () => {
      setVolumeState(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [updateStatus, reportPosition, onEnded, onPositionChange]);

  useEffect(() => {
    if (status === 'playing') {
      positionUpdateInterval.current = window.setInterval(() => {
        if (videoRef.current) {
          const positionTicks = Math.floor(videoRef.current.currentTime * 10000000);
          reportPosition(positionTicks);
        }
      }, 30000);
    }
    return () => {
      if (positionUpdateInterval.current) {
        clearInterval(positionUpdateInterval.current);
      }
    };
  }, [status, reportPosition]);

  useEffect(() => {
    if (item && startPosition > 0 && videoRef.current) {
      videoRef.current.currentTime = startPosition / 10000000;
    }
  }, [item, startPosition]);

  return {
    status,
    isPlaying: status === 'playing',
    isPaused: status === 'paused',
    isBuffering: status === 'buffering',
    error,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    isFullscreen,
    playbackSpeed,
    videoStreams,
    audioStreams,
    subtitleStreams,
    currentVideoStream,
    currentAudioStream,
    currentSubtitleStream,
    play,
    pause,
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
  };
}

export { PLAYBACK_SPEEDS };
