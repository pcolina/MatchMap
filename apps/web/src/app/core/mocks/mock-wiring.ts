import type { HttpInterceptorFn } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';
import { mockApolloLink } from './mock-apollo.link';
import { mockHttpInterceptor } from './mock-http.interceptor';

export const httpInterceptorsFor = (enabled: boolean, authInterceptor: HttpInterceptorFn): HttpInterceptorFn[] =>
  enabled ? [mockHttpInterceptor, authInterceptor] : [authInterceptor];

export const apolloLinkFor = (enabled: boolean, httpLink: ApolloLink): ApolloLink =>
  enabled ? ApolloLink.from([mockApolloLink, httpLink]) : httpLink;
