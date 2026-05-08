interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'text-xs px-1',
  md: 'text-sm px-1.5',
  lg: 'text-base px-2'
};

export function RatingBadge({ rating, maxRating = 10, size = 'sm' }: RatingBadgeProps) {
  const displayRating = maxRating === 10 ? rating.toFixed(1) : rating.toFixed(1);

  return (
    <div
      className={`rating-badge inline-flex items-center gap-0.5 rounded bg-black/70 font-medium text-yellow-400 ${SIZE_CLASSES[size]}`}
      title={`Rating: ${rating}/${maxRating}`}
    >
      <span>⭐</span>
      <span>{displayRating}</span>
    </div>
  );
}