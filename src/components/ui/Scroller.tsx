import React from 'react';

export type ScrollerDirection = 'horizontal' | 'vertical';

export interface ScrollerProps {
  children: React.ReactNode;
  direction?: ScrollerDirection;
  className?: string;
}

export function Scroller({
  children,
  direction = 'vertical',
  className = '',
}: ScrollerProps) {
  return (
    <div
      className={`
        overflow-auto
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
        ${direction === 'horizontal' ? 'flex overflow-x-auto' : 'overflow-y-auto'}
        ${className}
      `}
      role="region"
      aria-label={direction === 'horizontal' ? 'Horizontal scroller' : 'Vertical scroller'}
    >
      {children}
    </div>
  );
}