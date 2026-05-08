import { useState } from 'react';

interface ProgressBarProps {
  progress: number;
  duration: number;
  currentPosition: number;
  showHoverInfo?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const HEIGHT_CLASSES = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2'
};

function formatTime(ticks: number): string {
  const totalSeconds = Math.floor(ticks / 10000000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function ProgressBar({
  progress,
  duration,
  currentPosition,
  showHoverInfo = true,
  height = 'sm'
}: ProgressBarProps) {
  const [showInfo, setShowInfo] = useState(false);

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const remaining = duration - currentPosition;

  return (
    <div
      className="progress-bar-container relative w-full"
      onMouseEnter={() => showHoverInfo && setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div className={`w-full overflow-hidden rounded-full bg-white/30 ${HEIGHT_CLASSES[height]}`}>
        <div
          className="h-full rounded-full bg-emby-primary transition-all duration-200"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {showInfo && showHoverInfo && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white">
          <span className="text-emby-text-secondary">Played: {formatTime(currentPosition)}</span>
          <span className="mx-1">•</span>
          <span className="text-emby-text-secondary">Remaining: {formatTime(remaining)}</span>
        </div>
      )}
    </div>
  );
}