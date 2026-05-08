import './LoadingSpinner.css';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

export function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 48,
  };

  const dimension = sizeMap[size];

  return (
    <div
      className="loadingSpinner"
      style={{
        width: dimension,
        height: dimension,
        borderTopColor: color || '#52B54B',
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="srOnly">Loading...</span>
    </div>
  );
}