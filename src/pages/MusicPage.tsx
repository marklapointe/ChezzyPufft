import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLibraryStore } from '../store/libraryStore';
import { useLibraryItems } from '../hooks';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/layout';
import { MediaCard, MediaCardSkeleton } from '../components/media';
import { Select } from '../components/ui';

const SORT_OPTIONS = [
  { value: 'SortName', label: 'Name' },
  { value: 'Album,SortName', label: 'Album' },
  { value: 'CommunityRating,SortName', label: 'Rating' }
];

const SKELETON_COUNT = 16;

export function MusicPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const selectedLibrary = useLibraryStore((s) => s.selectedLibrary);
  const setSelectedLibrary = useLibraryStore((s) => s.setSelectedLibrary);
  const [sortBy, setSortBy] = useState('SortName');

  const { items, isLoading, error } = useLibraryItems(
    selectedLibrary?.Id ?? null,
    {
      includeMediaTypes: ['Audio'],
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
      setSelectedLibrary({ Id: user.Id, Name: 'Music', Type: 'Library' } as never);
    }
  }, [selectedLibrary, user, setSelectedLibrary]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Music"
        actions={
          <Select
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            className="w-40"
          />
        }
      />

      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <MediaCardSkeleton key={i} variant="square" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading music"
          message={error.message}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No music found"
          message="Your music library is empty."
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-6">
          {items.map((item) => (
            <MediaCard key={item.Id} item={item} variant="square" />
          ))}
        </div>
      )}
    </div>
  );
}