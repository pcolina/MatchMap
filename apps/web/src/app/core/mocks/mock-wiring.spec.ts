import { ApolloLink } from '@apollo/client';
import type { HttpInterceptorFn } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { apolloLinkFor, httpInterceptorsFor } from './mock-wiring';
import { mockApolloDispatch, mockHttpDispatch } from './mock-dispatch';

const authInterceptor: HttpInterceptorFn = (request, next) => next(request);

describe('mock wiring', () => {
  it('registers only the auth interceptor when the flag is off', () => {
    expect(httpInterceptorsFor(false, authInterceptor)).toEqual([authInterceptor]);
  });

  it('registers the mock dispatcher before the auth interceptor when the flag is on', () => {
    expect(httpInterceptorsFor(true, authInterceptor)).toEqual([mockHttpDispatch, authInterceptor]);
  });

  it('keeps the HTTP link when the flag is off', () => {
    const httpLink = ApolloLink.empty();

    expect(apolloLinkFor(false, httpLink)).toBe(httpLink);
  });

  it('puts the mock dispatcher in front of the HTTP link when the flag is on', () => {
    const httpLink = ApolloLink.empty();
    const link = apolloLinkFor(true, httpLink);

    expect(link).not.toBe(httpLink);
    expect(link).toBeInstanceOf(ApolloLink);
    expect(mockApolloDispatch).toBeInstanceOf(ApolloLink);
  });
});
