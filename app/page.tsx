'use client';

import { SearchInput } from '@/components/molecules/SearchInput';
import { CharacterTable } from '@/components/organisms/CharacterTable';
import { LocationChart } from '@/components/organisms/LocationChart';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { fetchCharacters } from '@/lib/fetch-characters';
import { Character, LocationStats } from '@/type/character';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from 'use-debounce';


export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadCharacters = useCallback(async (page: number, search: string, reset: boolean = false) => {
    setLoading(true);
    try {
      const data = await fetchCharacters(search, page);
      const newCharacters = data.characters.results;

      if (reset) {
        setCharacters(newCharacters);
      } else {
        setCharacters(prev => [...prev, ...newCharacters]);
      }

      setHasMore(data.characters.info.next !== null);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCharacters(1, '', true);
  }, [loadCharacters]);

  // Search effect
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    setCurrentPage(1);
    loadCharacters(1, debouncedSearchTerm, true);
  }, [debouncedSearchTerm, loadCharacters, searchTerm]);

  // Infinite scroll
  const fetchMoreData = useCallback(() => {
    if (!loading && hasMore) {
      loadCharacters(currentPage + 1, debouncedSearchTerm, false);
    }
  }, [loading, hasMore, currentPage, debouncedSearchTerm, loadCharacters]);

  useInfiniteScroll(fetchMoreData, hasMore);

  // Calculate location stats
  const locationStats: LocationStats[] = useMemo(() => {
    const locationCounts: Record<string, number> = {};

    characters.forEach(character => {
      const location = character.location.name;
      if (location && location !== 'unknown') {
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });

    return Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 locations
  }, [characters]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Rick & Morty characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rick & Morty Characters</h1>
          <p className="text-gray-600">Search and explore characters from the Rick & Morty universe</p>
        </header>

        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search characters by name..."
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Characters</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {characters.length} character{characters.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <CharacterTable characters={characters} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Distribution by location
                </p>
              </div>
              <div className="p-6">
                <LocationChart data={locationStats} />
              </div>
            </div>
          </div>
        </div>

        {hasMore && !loading && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Scroll down to load more characters...</p>
          </div>
        )}
      </div>
    </div>
  );
}
