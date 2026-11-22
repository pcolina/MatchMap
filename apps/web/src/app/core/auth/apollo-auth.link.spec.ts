import { ApolloLink, Observable } from '@apollo/client';
import { parse } from 'graphql';
import { apolloAuthLink } from './apollo-auth.link';

const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

const run = async (token: string | null): Promise<Record<string, string> | undefined> => {
  let seen: Record<string, string> | undefined;
  const terminating = new ApolloLink(
    (operation) =>
      new Observable((observer) => {
        seen = operation.getContext()['headers'] as Record<string, string> | undefined;
        observer.next({ data: {} });
        observer.complete();
      }),
  );
  ApolloLink.execute(
    ApolloLink.from([apolloAuthLink(() => token), terminating]),
    { query: parse('query Me { me { id } }'), variables: {} },
    {} as ApolloLink.ExecuteContext,
  ).subscribe({ next: () => undefined });
  await settle();
  return seen;
};

describe('apolloAuthLink', () => {
  it('sends the access token as a bearer Authorization header', async () => {
    expect((await run('token-1'))?.['Authorization']).toBe('Bearer token-1');
  });

  it('sends no Authorization header while there is no access token', async () => {
    expect((await run(null))?.['Authorization']).toBeUndefined();
  });
});
