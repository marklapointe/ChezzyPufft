

export type ProgressVariant = 'linear' | 'circular';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  className?: string;
}

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const circularSizeStyles: Record<ProgressSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function Progress({
  value,
  variant = 'linear',
  size = 'md',
  className = '',
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  if (variant === 'circular') {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedValue / 100) * circumference;

    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${clampedValue}%`}
      >
        <svg
          className={`${circularSizeStyles[size]} transform -rotate-90`}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-gray-700"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-emby-primary transition-all duration-300"
          />
        </svg>
        <span className="absolute text-xs text-white font-medium">
          {Math.round(clampedValue)}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]} ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clampedValue}%`}
    >
      <div
        className="h-full bg-emby-primary rounded-full transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}