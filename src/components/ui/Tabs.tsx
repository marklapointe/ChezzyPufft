import React from 'react';

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onTabChange(tabs[newIndex].id);
  };

  return (
    <div
      className={`flex border-b border-gray-700 ${className}`}
      role="tablist"
      aria-orientation="horizontal"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const tabIndex = tabs.findIndex((t) => t.id === activeTab);

        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tabIndex)}
            className={`
              px-4 py-2 text-sm font-medium
              border-b-2 -mb-px
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emby-primary
              ${
                isActive
                  ? 'border-emby-primary text-emby-primary'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  activeTab,
  children,
  className = '',
}: {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isActive = id === activeTab;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={`pt-4 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
}