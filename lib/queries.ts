import { gql } from 'graphql-request';

export const CHARACTERS_QUERY = gql`
  query ($name: String) {
    characters(filter: { name: $name }) {
      results {
        id
        name
        image
      }
    }
  }
`;
