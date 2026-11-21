import type { HttpInterceptorFn } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';
import { mockApolloDispatch, mockHttpDispatch } from './mock-dispatch';

export const httpInterceptorsFor = (enabled: boolean, authInterceptor: HttpInterceptorFn): HttpInterceptorFn[] =>
  enabled ? [mockHttpDispatch, authInterceptor] : [authInterceptor];

export const apolloLinkFor = (enabled: boolean, httpLink: ApolloLink): ApolloLink =>
  enabled ? ApolloLink.from([mockApolloDispatch, httpLink]) : httpLink;
