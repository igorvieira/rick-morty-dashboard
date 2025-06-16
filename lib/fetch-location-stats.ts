import { LocationStats } from '@/type/character';
import { graphqlClient } from './graphql-client';
import { gql } from 'graphql-request';



const OPTIMIZED_LOCATION_QUERY = gql`
  query GetLocationStatsOptimized($name: String, $page: Int) {
    characters(filter: { name: $name }, page: $page) {
      info {
        next
      }
      results {
        location {
          name
        }
      }
    }
  }
`;

/**
 * In-memory cache for location statistics
 * Key: search term (e.g., "locations:rick" or "locations:all")
 * Value: { data: LocationStats[], timestamp: number }
 */
const locationCache = new Map<string, { data: LocationStats[]; timestamp: number }>();

/**
 * Cache Time-To-Live: 2 minutes
 * Balances performance (avoids excessive API calls) with data freshness
 */
const CACHE_TTL = 2 * 60 * 1000;

/**
 * Generates a unique cache key for the given search term
 * @param searchName - The character name to search for (optional)
 * @returns Cache key string in format "locations:{searchName}"
 */
function getCacheKey(searchName: string): string {
  return `locations:${searchName || 'all'}`;
}

/**
 * Checks if a cached entry has exceeded the TTL and should be considered expired
 * @param timestamp - The timestamp when the data was cached
 * @returns true if the cache entry is expired, false otherwise
 */
function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_TTL;
}

/**
 * Fetches and aggregates location statistics for Rick & Morty characters
 * 
 * Performance optimizations:
 * - Uses in-memory caching with 2-minute TTL
 * - Parallel requests for faster data fetching
 * - Limited to 3 pages (60 characters) for balance between completeness and speed
 * - Only fetches location.name field to minimize data transfer
 * - Returns top 8 locations to reduce processing and rendering time
 * 
 * @param searchName - Optional character name to filter by
 * @returns Promise<LocationStats[]> - Array of location statistics sorted by count (descending)
 * 
 * @example
 * // Get all location stats
 * const allStats = await fetchLocationStats();
 * 
 * // Get location stats for characters matching "Rick"
 * const rickStats = await fetchLocationStats("Rick");
 */
export async function fetchLocationStats(searchName?: string): Promise<LocationStats[]> {
  const cacheKey = getCacheKey(searchName || '');
  const cached = locationCache.get(cacheKey);

  // Return cached data if available and not expired
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data;
  }

  try {
    /**
     * Location counts accumulator
     * Key: location name (e.g., "Earth", "Citadel of Ricks")
     * Value: number of characters in that location
     */
    const locationCounts: Record<string, number> = {};
    
    /**
     * Strategy 1: No search term (general overview)
     * Fetch first 3 pages in parallel for faster loading
     * Provides good overview without excessive API calls
     */
    if (!searchName?.trim()) {
      const promises = [1, 2, 3].map(page => 
        graphqlClient.request<{
          characters: {
            info: { next: number | null };
            results: Array<{ location: { name: string } }>;
          };
        }>(OPTIMIZED_LOCATION_QUERY, { page })
      );

      const results = await Promise.all(promises);
      
      // Aggregate location counts from all pages
      results.forEach(data => {
        data.characters.results.forEach(character => {
          const location = character.location.name;
          if (location && location !== 'unknown') {
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });
      });
    } else {
      /**
       * Strategy 2: With search term (filtered results)
       * Fetch 3 pages in parallel with character name filter
       * Limited to 3 pages to balance completeness with performance
       */
       const promises: Array<ReturnType<typeof graphqlClient.request>> = [];
      
      for (let page = 1; page <= 3; page++) {
        promises.push(
          graphqlClient.request<{
            characters: {
              info: { next: number | null };
              results: Array<{ location: { name: string } }>;
            };
          }>(OPTIMIZED_LOCATION_QUERY, {
            name: searchName,
            page,
          })
        );
      }

      const results = await Promise.all(promises) as Array<{
        characters: {
          info: { next: number | null };
          results: Array<{ location: { name: string } }>;
        };
      }>;
      
      results.forEach(data => {
        data.characters.results.forEach((character: { location: { name: string; }; }) => {
          const location = character.location.name;
          if (location && location !== 'unknown') {
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });
      });
    }

    /**
     * Transform and sort location data:
     * 1. Convert Record<string, number> to LocationStats[]
     * 2. Sort by count (descending) - most populated locations first
     * 3. Limit to top 8 locations for performance (fewer DOM elements)
     */
    const locationStats = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    locationCache.set(cacheKey, {
      data: locationStats,
      timestamp: Date.now()
    });

    return locationStats;
    
  } catch (error) {
    console.error('Error fetching location stats:', error);
    return [];
  }
}