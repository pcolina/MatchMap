import { describe, expect, it } from 'vitest';
import { apolloOptions } from './apollo.ts';

describe('apolloOptions', () => {
  it('points the GraphQL link at the base URL plus /graphql', () => {
    const created: { uri: string }[] = [];
    const httpLink = { create: (options: { uri: string }) => (created.push(options), {}) };

    const options = apolloOptions(httpLink as never, 'http://10.0.2.2:8080');

    expect(created).toEqual([{ uri: 'http://10.0.2.2:8080/graphql' }]);
    expect(options.cache).toBeDefined();
  });
});
