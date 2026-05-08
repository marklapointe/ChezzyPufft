import { useState } from 'react';
import type { BaseItemDto } from '../../api/types';

type PlayButtonVariant = 'icon' | 'icon-text' | 'filled';

interface PlayButtonProps {
  item: BaseItemDto;
  variant?: PlayButtonVariant;
  onPlay?: (item: BaseItemDto) => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base'
};

export function PlayButton({ item, variant = 'icon', onPlay, size = 'md' }: PlayButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    onPlay?.(item);
  };

  const sizeClass = SIZE_CLASSES[size];

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`play-button-icon group relative flex items-center justify-center rounded-full bg-emby-primary/80 text-white transition-all hover:bg-emby-primary hover:scale-110 ${sizeClass}`}
        aria-label={`Play ${item.Name}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-base">▶️</span>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white">
            {item.Name}
          </div>
        )}
      </button>
    );
  }

  if (variant === 'icon-text') {
    return (
      <button
        onClick={handleClick}
        className="play-button-icon-text flex items-center gap-2 rounded-full bg-emby-primary/80 px-4 py-2 text-white transition-all hover:bg-emby-primary"
        aria-label={`Play ${item.Name}`}
      >
        <span className="text-sm">▶️</span>
        <span className="text-sm font-medium">
          Play <span className="hidden sm:inline">{item.Name}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="play-button-filled flex w-full items-center justify-center gap-2 rounded-lg bg-emby-primary py-3 text-white transition-all hover:bg-emby-secondary"
      aria-label={`Play ${item.Name}`}
    >
      <span>▶️</span>
      <span className="font-medium">{item.Name}</span>
    </button>
  );
}