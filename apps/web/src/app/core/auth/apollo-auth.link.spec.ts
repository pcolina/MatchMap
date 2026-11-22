import { ApolloLink, Observable } from '@apollo/client';
import { parse } from 'graphql';
import { apolloAuthLink } from './apollo-auth.link';

const run = (token: string | null): Record<string, string> | undefined => {
  let seen: Record<string, string> | undefined;
  const terminating = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        seen = operation.getContext()['headers'] as Record<string, string> | undefined;
        observer.next({ data: {} });
        observer.complete();
      }),
  );
  ApolloLink.execute(ApolloLink.from([apolloAuthLink(() => token), terminating]), {
    query: parse('query Me { me { id } }'),
    variables: {},
    operationName: 'Me',
  }).subscribe({ next: () => undefined });
  return seen;
};

describe('apolloAuthLink', () => {
  it('sends the access token as a bearer Authorization header', () => {
    expect(run('token-1')?.['Authorization']).toBe('Bearer token-1');
  });

  it('sends no Authorization header while there is no access token', () => {
    expect(run(null)?.['Authorization']).toBeUndefined();
  });
});
