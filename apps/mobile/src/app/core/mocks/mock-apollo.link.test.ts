import { ApolloLink, gql } from '@apollo/client';
import { beforeEach, expect, test } from 'vitest';
import { apiVersion as apiVersionOperation, registerMutation, signIn } from '@matchmap/shared';
import { mockApolloLink } from './mock-apollo.link.ts';
import { getMockState, mockContext, resetMockState } from './mock-state.ts';

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

beforeEach(() => {
  resetMockState();
});

test('registers a user and returns the requested fields', async () => {
  const result = await run(gql(registerMutation), { input: { email: 'New.User@MatchMap.test', password: 'Fresh-pass1' } });

  expect(result.errors).toBeUndefined();
  expect(result.data?.['register']).toMatchObject({ email: 'new.user@matchmap.test' });
});

test('returns EMAIL_TAKEN for an email in use', async () => {
  const result = await run(gql(registerMutation), { input: { email: 'one@matchmap.test', password: 'Fresh-pass1' } });

  expect(result.errors?.[0].extensions).toEqual({ code: 'EMAIL_TAKEN' });
});

test('returns me for a valid access token', async () => {
  const signedIn = signIn(getMockState(), { client: 'mobile', email: 'one@matchmap.test', password: 'One-pass1' }, mockContext());
  const token = (signedIn.body as { accessToken: string }).accessToken;

  const result = await run(meQuery, {}, { authorization: `Bearer ${token}` });

  expect(result.data?.['me']).toMatchObject({ email: 'one@matchmap.test', username: 'one' });
});

test('fails with 401 for me without an access token', async () => {
  await expect(run(meQuery)).rejects.toMatchObject({ statusCode: 401 });
});

test('returns the api version', async () => {
  const result = await run(apiVersionQuery);

  expect(result.data?.['apiVersion']).toBe(apiVersionOperation().data.apiVersion);
});
