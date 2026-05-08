import { useState, useRef, useEffect } from 'react';

interface BackdropImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackGradient?: string;
}

export function BackdropImage({
  src,
  alt,
  className = '',
  fallbackGradient = 'from-emby-surface via-emby-surface/50 to-black'
}: BackdropImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-4xl font-bold text-emby-text-secondary/30">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-emby-surface animate-pulse" />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-500 ${
          isLoaded ? 'scale-100 blur-0' : 'scale-105 blur-lg'
        }`}
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
}