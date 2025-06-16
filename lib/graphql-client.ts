import { GraphQLClient, Variables } from 'graphql-request';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

class CachedGraphQLClient {
  private client: GraphQLClient;
  private cache = new Map<string, CacheEntry>();
  private cacheTTL = 5 * 60 * 1000;

  constructor(endpoint: string) {
    this.client = new GraphQLClient(endpoint);
  }

  private getCacheKey(query: string, variables?: Variables): string {
    return JSON.stringify({ query, variables });
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheTTL;
  }

  async request<T>(query: string, variables?: Variables): Promise<T> {
    const cacheKey = this.getCacheKey(query, variables);
    const cached = this.cache.get(cacheKey);

    if (cached && !this.isExpired(cached.timestamp)) {
      console.log('🔄 Cache hit:', cacheKey.substring(0, 50) + '...');
      return cached.data as T;
    }

    console.log('🌐 Fetching from API:', cacheKey.substring(0, 50) + '...');
    const data = await this.client.request<T>(query, variables);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

export const graphqlClient = new CachedGraphQLClient('https://rickandmortyapi.com/graphql');