import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLibraryStore } from '../store/libraryStore';
import { useLibraryItems } from '../hooks';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/layout';
import { MediaCard, MediaCardSkeleton } from '../components/media';
import { Tabs, Select } from '../components/ui';

const SORT_OPTIONS = [
  { value: 'SortName', label: 'Name' },
  { value: 'ProductionYear,SortName', label: 'Year' },
  { value: 'CommunityRating,SortName', label: 'Rating' }
];

const SKELETON_COUNT = 12;

export function TVShowsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const selectedLibrary = useLibraryStore((s) => s.selectedLibrary);
  const setSelectedLibrary = useLibraryStore((s) => s.setSelectedLibrary);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('SortName');

  const { items, isLoading, error } = useLibraryItems(
    selectedLibrary?.Id ?? null,
    {
      includeMediaTypes: ['Series', 'Season'],
      sortBy: [sortBy],
      sortOrder: 'Ascending',
      limit: 50
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedLibrary === null && user) {
      setSelectedLibrary({ Id: user.Id, Name: 'TV Shows', Type: 'Library' } as never);
    }
  }, [selectedLibrary, user, setSelectedLibrary]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'genres', label: 'Genres' }
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="TV Shows"
        actions={
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            className="w-40"
          />
        }
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-6"
      />

      {activeTab === 'all' && (
        <>
          {isLoading && items.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <MediaCardSkeleton key={i} variant="portrait" />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Error loading TV shows"
              message={error.message}
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="No TV shows found"
              message="Your TV show library is empty."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
              {items.map((item) => (
                <MediaCard
                  key={item.Id}
                  item={item}
                  variant="portrait"
                  unplayedCount={item.RecursiveItemCount}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'genres' && (
        <div className="mt-6 text-emby-text-secondary">
          Genre filtering coming soon...
        </div>
      )}
    </div>
  );
}