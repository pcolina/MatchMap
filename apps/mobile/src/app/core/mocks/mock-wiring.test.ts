import { ApolloLink } from '@apollo/client';
import { describe, expect, it, vi } from 'vitest';
import { apolloLinkFor, httpInterceptorsFor } from './mock-wiring.ts';
import { mockHttpInterceptor } from './mock-http.interceptor.ts';
import { mockApolloLink } from './mock-apollo.link.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(async () => null), deleteItemAsync: vi.fn() }));

const authInterceptor = (request: unknown, next: (request: unknown) => unknown) => next(request);

describe('mobile mock wiring', () => {
  it('registers only the auth interceptor when the flag is off', () => {
    expect(httpInterceptorsFor(false, authInterceptor as never)).toEqual([authInterceptor]);
  });

  it('registers the mock interceptor before the auth interceptor when the flag is on', () => {
    expect(httpInterceptorsFor(true, authInterceptor as never)).toEqual([mockHttpInterceptor, authInterceptor]);
  });

  it('keeps the HTTP link when the flag is off', () => {
    const httpLink = ApolloLink.empty();

    expect(apolloLinkFor(false, httpLink)).toBe(httpLink);
  });

  it('puts the mock link in front of the HTTP link when the flag is on', () => {
    const httpLink = ApolloLink.empty();
    const link = apolloLinkFor(true, httpLink);

    expect(link).not.toBe(httpLink);
    expect(link).toBeInstanceOf(ApolloLink);
    expect(mockApolloLink).toBeInstanceOf(ApolloLink);
  });
});
