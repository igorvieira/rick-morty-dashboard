import { gql } from 'graphql-request';

export const LOCATION_STATS_QUERY = gql`
  query GetLocationStats {
    characters {
      results {
        location {
          name
        }
      }
    }
  }
`;

export const CHARACTERS_QUERY = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin {
          name
          id
        }
        location {
          name
          id
        }
        image
        episode {
          id
          name
        }
      }
    }
  }
`;
