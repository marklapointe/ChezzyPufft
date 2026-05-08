import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="emptyState">
      {icon && <div className="emptyStateIcon">{icon}</div>}
      <h2 className="emptyStateTitle">{title}</h2>
      {message && <p className="emptyStateMessage">{message}</p>}
      {action && (
        <button className="emptyStateAction" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}