import { CharactersResponse } from '@/type/character';
import { graphqlClient } from './graphql-client';
import { CHARACTERS_QUERY } from './queries';

export async function fetchCharacters(name?: string, page: number = 1): Promise<CharactersResponse> {
  try {
    const data = await graphqlClient.request<CharactersResponse>(CHARACTERS_QUERY, {
      page,
      name: name || undefined,
    });
    return data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    return {
      characters: {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      },
    };
  }
}