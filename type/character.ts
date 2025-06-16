export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    id?: string;
  };
  location: {
    name: string;
    id?: string;
  };
  image: string;
  episode: Array<{
    id: string;
    name: string;
  }>;
}

export interface CharactersResponse {
  characters: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Character[];
  };
}

export interface LocationStats {
  name: string;
  count: number;
}