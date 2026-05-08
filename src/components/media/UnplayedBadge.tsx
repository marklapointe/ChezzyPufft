interface UnplayedBadgeProps {
  count: number;
  maxDisplay?: number;
}

export function UnplayedBadge({ count, maxDisplay = 99 }: UnplayedBadgeProps) {
  const displayCount = count > maxDisplay ? `${maxDisplay}+` : count.toString();

  return (
    <div
      className="unplayed-badge flex h-5 min-w-5 items-center justify-center rounded-full bg-emby-primary px-1 text-xs font-bold text-white"
      title={`${count} unplayed items`}
    >
      <span>{displayCount}</span>
    </div>
  );
}