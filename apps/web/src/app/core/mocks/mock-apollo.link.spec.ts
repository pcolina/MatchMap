import { ApolloLink } from '@apollo/client';
import { gql } from 'apollo-angular';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerMutation, signIn } from '@matchmap/shared';
import { mockApolloLink } from './mock-apollo.link';
import { getMockState, mockContext, resetMockState } from './mock-state';

const meQuery = gql`
  query Me {
    me {
      id
      email
      username
      createdAt
    }
  }
`;

const apiVersionQuery = gql`
  query ApiVersion {
    apiVersion
  }
`;

const run = (query: unknown, variables: Record<string, unknown> = {}, headers: Record<string, string> = {}) =>
  new Promise<{ data?: Record<string, unknown>; errors?: { extensions?: Record<string, unknown> }[] }>((resolve, reject) => {
    ApolloLink.execute(mockApolloLink, { query, variables, context: { headers } } as never, {} as never).subscribe({
      next: (result) => resolve(result as never),
      error: reject,
    });
  });

describe('mockApolloLink', () => {
  beforeEach(() => resetMockState());
  afterEach(() => resetMockState());

  it('registers a user and returns the requested fields', async () => {
    const result = await run(gql(registerMutation), { input: { email: 'New.User@MatchMap.test', password: 'Fresh-pass1' } });

    expect(result.errors).toBeUndefined();
    expect(result.data?.['register']).toMatchObject({ email: 'new.user@matchmap.test' });
  });

  it('returns EMAIL_TAKEN for an email in use', async () => {
    const result = await run(gql(registerMutation), { input: { email: 'mock@matchmap.test', password: 'Fresh-pass1' } });

    expect(result.errors?.[0].extensions).toEqual({ code: 'EMAIL_TAKEN' });
  });

  it('returns PASSWORD_INVALID with the password field', async () => {
    const result = await run(gql(registerMutation), { input: { email: 'fresh@matchmap.test', password: 'abcdef' } });

    expect(result.errors?.[0].extensions).toEqual({ code: 'PASSWORD_INVALID', field: 'password' });
  });

  it('returns me for a valid access token', async () => {
    const signedIn = signIn(getMockState(), { client: 'web', email: 'mock@matchmap.test', password: 'Mock-pass1' }, mockContext());
    const token = (signedIn.body as { accessToken: string }).accessToken;

    const result = await run(meQuery, {}, { authorization: `Bearer ${token}` });

    expect(result.data?.['me']).toMatchObject({ email: 'mock@matchmap.test', username: 'mock' });
  });

  it('fails with 401 for me without an access token', async () => {
    await expect(run(meQuery)).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns the api version', async () => {
    const result = await run(apiVersionQuery);

    expect(result.data?.['apiVersion']).toBe('0.1.0-SNAPSHOT');
  });
});
