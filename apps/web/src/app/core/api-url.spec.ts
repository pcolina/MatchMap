import { apiUrl, graphqlUrl } from './api-url';

export {};

describe('apiUrl', () => {
  it('keeps the path relative when the base is empty', () => {
    expect(apiUrl('/api/auth/login', '')).toBe('/api/auth/login');
  });

  it('prefixes the path with an absolute base', () => {
    expect(apiUrl('/graphql', 'http://localhost:8080')).toBe('http://localhost:8080/graphql');
  });

  it('builds the GraphQL endpoint from the base', () => {
    expect(graphqlUrl('')).toBe('/graphql');
    expect(graphqlUrl('http://localhost:8080')).toBe('http://localhost:8080/graphql');
  });
});
