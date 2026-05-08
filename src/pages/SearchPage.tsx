import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSearch } from '../hooks';
import { MediaCard, MediaCardSkeleton } from '../components/media';
import { EmptyState } from '../components/layout';
import { Tabs } from '../components/ui';
import { ItemType, type BaseItemDto } from '../api/types';

const RECENT_SEARCHES_KEY = 'chezzyPufft_recentSearches';
const MAX_RECENT_SEARCHES = 10;

type FilterType = 'all' | 'movies' | 'tv' | 'music';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'movies', label: 'Movies' },
  { id: 'tv', label: 'TV' },
  { id: 'music', label: 'Music' }
];

const MOVIE_TYPES = [ItemType.Movie, ItemType.Video, ItemType.Trailer];
const TV_TYPES = [ItemType.Series, ItemType.Season, ItemType.Episode];
const MUSIC_TYPES = [ItemType.MusicAlbum, ItemType.MusicArtist, ItemType.Audio, ItemType.MusicVideo, ItemType.Playlist];

function getItemTypesForFilter(filter: FilterType): ItemType[] | null {
  switch (filter) {
    case 'movies':
      return MOVIE_TYPES;
    case 'tv':
      return TV_TYPES;
    case 'music':
      return MUSIC_TYPES;
    default:
      return null;
  }
}

function filterItemsByType(items: BaseItemDto[], filter: FilterType): BaseItemDto[] {
  const allowedTypes = getItemTypesForFilter(filter);
  if (!allowedTypes) return items;
  return items.filter((item) => allowedTypes.includes(item.Type as ItemType));
}

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches().filter((s) => s !== query);
    searches.unshift(query);
    const trimmed = searches.slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(trimmed));
  } catch {
  }
}

function removeRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches().filter((s) => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
  }
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SearchIconLarge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export function SearchPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { items, isLoading } = useSearch(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const handleRecentSearchClick = useCallback((searchQuery: string) => {
    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    setQuery(searchQuery);
    setDebouncedQuery(searchQuery);
  }, []);

  const handleRemoveRecentSearch = useCallback((e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeRecentSearch(query);
    setRecentSearches(getRecentSearches());
  }, []);

  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId as FilterType);
  }, []);

  const filteredItems = filterItemsByType(items, activeFilter);
  const showResults = debouncedQuery.trim().length >= 2;
  const showRecentSearches = !showResults && recentSearches.length > 0;
  const showEmptyQuery = !showResults && query.length === 0 && recentSearches.length === 0;
  const showNoResults = showResults && !isLoading && filteredItems.length === 0;

  return (
    <div className="min-h-screen bg-emby-bg">
      <div className="sticky top-0 z-10 bg-emby-bg/95 backdrop-blur-sm border-b border-emby-border">
        <div className="p-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emby-text-secondary">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, music..."
              className="w-full h-14 pl-12 pr-12 bg-emby-surface text-white placeholder:text-emby-text-secondary rounded-lg border border-emby-border focus:border-emby-primary focus:outline-none focus:ring-2 focus:ring-emby-primary/50 transition-all text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emby-text-secondary hover:text-white transition-colors p-1"
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
          </div>

          <div className="mt-4">
            <Tabs
              tabs={FILTER_TABS}
              activeTab={activeFilter}
              onTabChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {showResults && !isLoading && filteredItems.length > 0 && (
          <p className="text-emby-text-secondary text-sm mb-4">
            {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{debouncedQuery}"
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MediaCardSkeleton key={i} variant="portrait" />
            ))}
          </div>
        )}

        {!showResults && showEmptyQuery && (
          <EmptyState
            icon={<SearchIconLarge />}
            title="Search for movies, TV shows, music..."
            message="Start typing to search across your entire library"
          />
        )}

        {showNoResults && (
          <EmptyState
            icon={<SearchIconLarge />}
            title="No results found"
            message={`We couldn't find anything for "${debouncedQuery}". Try a different search term.`}
          />
        )}

        {showRecentSearches && !isLoading && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Searches</h2>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={`${search}-${index}`}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center justify-between p-3 bg-emby-surface rounded-lg cursor-pointer hover:bg-emby-surface/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-emby-text-secondary hover:text-white transition-colors">
                    <ClockIcon />
                    <span>{search}</span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveRecentSearch(e, search)}
                    className="text-emby-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1"
                    aria-label={`Remove ${search} from recent searches`}
                  >
                    <ClearIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResults && !isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <MediaCard key={item.Id} item={item} variant="portrait" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}