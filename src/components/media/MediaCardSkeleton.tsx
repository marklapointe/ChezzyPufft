import type { MediaCardVariant } from './MediaCard';

interface MediaCardSkeletonProps {
  variant?: MediaCardVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<MediaCardVariant, string> = {
  default: 'aspect-[2/3]',
  portrait: 'aspect-[2/3]',
  square: 'aspect-square',
  backdrop: 'aspect-video'
};

export function MediaCardSkeleton({ variant = 'default', className = '' }: MediaCardSkeletonProps) {
  return (
    <div
      className={`media-card-skeleton relative overflow-hidden rounded-lg bg-emby-surface ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <div className="shimmer absolute inset-0" />
    </div>
  );
}