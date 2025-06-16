'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchCharacters } from '@/lib/fetch-characters';
import { SearchInput } from '@/components/molecules/SearchInput';
import { CharacterTable } from '@/components/organisms/CharacterTable';
import { LocationChart } from '@/components/organisms/LocationChart';
import { Modal } from '@/components/atoms/Modal';
import { ScrollToTop } from '@/components/atoms/ScrollToTop';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlParams } from '@/hooks/useUrlParams';
import { Button } from '@/components/atoms/Buttons';
import { Character } from '@/type/character';

function HomeContent() {
  const { updateParam, getParam } = useUrlParams();
  const initialSearchTerm = getParam('search');

  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    updateParam('search', debouncedSearchTerm);
  }, [debouncedSearchTerm, updateParam]);

  const loadCharacters = useCallback(async (page: number, search: string, reset: boolean = false) => {
    if (reset) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

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

  useEffect(() => {
    loadCharacters(1, initialSearchTerm, true);
  }, [loadCharacters, initialSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    setCurrentPage(1);
    loadCharacters(1, debouncedSearchTerm, true);
  }, [debouncedSearchTerm, loadCharacters, searchTerm]);

  const fetchMoreData = useCallback(() => {
    if (!loading && hasMore) {
      loadCharacters(currentPage + 1, debouncedSearchTerm, false);
    }
  }, [loading, hasMore, currentPage, debouncedSearchTerm, loadCharacters]);

  const [, observerRef] = useInfiniteScroll(fetchMoreData, hasMore);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCharacterClick = (characterName: string) => {
    setSearchTerm(characterName);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const showChartButton = debouncedSearchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rick & Morty Characters</h1>
          <p className="text-gray-600">Search and explore characters from the Rick & Morty universe</p>
        </header>

        <div className="mb-6 flex items-center gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search characters by name..."
            className="w-96"
          />

          {showChartButton && (
            <Button
              onClick={handleOpenModal}
              variant="secondary"
              className="whitespace-nowrap h-11 cursor-pointer"
            >
              View Chart
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Characters</h2>
            <p className="text-sm text-gray-500 mt-1">
              {characters.length} character{characters.length !== 1 ? 's' : ''} found
              {debouncedSearchTerm && (
                <span className="ml-1">
                  {`for "${debouncedSearchTerm}"`}
                </span>
              )}
            </p>
          </div>
          <CharacterTable
            characters={characters}
            loading={loading}
            initialLoading={initialLoading}
            onCharacterClick={handleCharacterClick}
          />
        </div>

        {hasMore && !loading && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Scroll down to load more characters...</p>
          </div>
        )}

        <div ref={observerRef} className="h-4" />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Location Distribution"
        >
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              {`Character distribution by location${debouncedSearchTerm ? ` for "${debouncedSearchTerm}"` : ''}`}
            </p>
            <LocationChart searchTerm={debouncedSearchTerm} />
          </div>
        </Modal>
      </div>

      <ScrollToTop threshold={300} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Rick & Morty characters...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}