import type { ReactNode } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="pageHeader">
      <div className="pageHeaderContent">
        <h1 className="pageTitle">{title}</h1>
        {subtitle && <p className="pageSubtitle">{subtitle}</p>}
      </div>
      {actions && <div className="pageHeaderActions">{actions}</div>}
    </div>
  );
}