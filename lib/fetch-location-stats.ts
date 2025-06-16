import { LocationStats } from '@/type/character';
import { graphqlClient } from './graphql-client';
import { gql } from 'graphql-request';


export async function fetchLocationStats(searchName?: string): Promise<LocationStats[]> {
  try {
    let allResults: Array<{ location: { name: string } }> = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page <= 10) {
      const PAGINATED_QUERY = gql`
        query GetLocationStats($name: String, $page: Int) {
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

      const data = await graphqlClient.request<{
        characters: {
          info: { next: number | null };
          results: Array<{ location: { name: string } }>;
        };
      }>(PAGINATED_QUERY, {
        name: searchName || undefined,
        page,
      });

      allResults = [...allResults, ...data.characters.results];
      hasNextPage = data.characters.info.next !== null;
      page++;
    }

    const locationCounts: Record<string, number> = {};

    allResults.forEach(character => {
      const location = character.location.name;
      if (location && location !== 'unknown') {
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });

    console.log(Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: { name: string, count: number }, b: { name: string, count: number }) => b.count - a.count)
      .slice(0, 10))


    return Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: { name: string, count: number }, b: { name: string, count: number }) => b.count - a.count)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching location stats:', error);
    return [];
  }
}
