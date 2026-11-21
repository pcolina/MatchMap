import { ApolloLink } from '@apollo/client';
import type { HttpInterceptorFn } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { apolloLinkFor, httpInterceptorsFor } from './mock-wiring';
import { mockHttpInterceptor } from './mock-http.interceptor';
import { mockApolloLink } from './mock-apollo.link';

const authInterceptor: HttpInterceptorFn = (request, next) => next(request);

describe('mock wiring', () => {
  it('registers only the auth interceptor when the flag is off', () => {
    expect(httpInterceptorsFor(false, authInterceptor)).toEqual([authInterceptor]);
  });

  it('registers the mock interceptor before the auth interceptor when the flag is on', () => {
    expect(httpInterceptorsFor(true, authInterceptor)).toEqual([mockHttpInterceptor, authInterceptor]);
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
