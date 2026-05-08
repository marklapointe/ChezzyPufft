import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { BaseItemDto, ItemType } from '../../api/types';

interface Position {
  x: number;
  y: number;
}

interface ItemContextMenuProps {
  item: BaseItemDto;
  position: Position;
  onClose: () => void;
  onPlay?: (item: BaseItemDto) => void;
  onAddToQueue?: (item: BaseItemDto) => void;
  onTogglePlayed?: (item: BaseItemDto) => void;
  onToggleFavorite?: (item: BaseItemDto) => void;
  isPlayed?: boolean;
  isFavorite?: boolean;
}

interface MenuAction {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}

function getItemTypeIcon(type?: ItemType): string {
  switch (type) {
    case 'Movie':
    case 'Video':
      return '🎬';
    case 'Series':
      return '📺';
    case 'Episode':
      return '🎞️';
    case 'MusicAlbum':
      return '💿';
    case 'Audio':
      return '🎵';
    default:
      return '📄';
  }
}

export function ItemContextMenu({
  item,
  position,
  onClose,
  onPlay,
  onAddToQueue,
  onTogglePlayed,
  onToggleFavorite,
  isPlayed = false,
  isFavorite = false
}: ItemContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const actions: MenuAction[] = [
    {
      label: 'Play',
      icon: '▶️',
      onClick: () => onPlay?.(item)
    },
    {
      label: 'Add to Queue',
      icon: '➕',
      onClick: () => onAddToQueue?.(item)
    },
    {
      label: isPlayed ? 'Mark as Unplayed' : 'Mark as Played',
      icon: isPlayed ? '❌' : '✓',
      onClick: () => onTogglePlayed?.(item)
    },
    {
      label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      icon: isFavorite ? '💔' : '❤️',
      onClick: () => onToggleFavorite?.(item)
    }
  ];

  if (item.Type === 'Episode' && item.SeriesId) {
    actions.push({
      label: 'Go to Series',
      icon: '📁',
      onClick: () => {
        window.location.href = `/series/${item.SeriesId}`;
        onClose();
      }
    });
  }

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200),
    y: Math.min(position.y, window.innerHeight - actions.length * 40 - 20)
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] overflow-hidden rounded-lg bg-emby-surface shadow-xl"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      <div className="border-b border-emby-text-secondary/20 px-3 py-2">
        <span className="text-sm font-medium text-white">
          {getItemTypeIcon(item.Type)} {item.Name}
        </span>
      </div>
      <div className="py-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-emby-text-secondary hover:bg-emby-primary/20 hover:text-white"
          >
            <span>{action.icon}</span>
            <span className={action.danger ? 'text-red-400' : ''}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}