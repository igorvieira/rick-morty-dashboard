import { graphqlClient } from './graphql-client';
import { CHARACTERS_QUERY } from './queries';

export async function fetchCharacters(name?: string) {
  try {
    const data = await graphqlClient.request(CHARACTERS_QUERY, { name });
    return data.characters?.results ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
