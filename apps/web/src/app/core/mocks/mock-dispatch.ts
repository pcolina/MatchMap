import type { HttpInterceptorFn } from '@angular/common/http';
import type { ApolloLink } from '@apollo/client';
import { ApolloLink as Link } from '@apollo/client';

export type MockHandlers = {
  http: HttpInterceptorFn;
  apollo: ApolloLink;
};

let handlers: MockHandlers | undefined;

export const installMockHandlers = (next: MockHandlers | undefined): void => {
  handlers = next;
};

export const mockHttpDispatch: HttpInterceptorFn = (request, next) =>
  handlers ? handlers.http(request, next) : next(request);

export const mockApolloDispatch = new Link((operation, forward) =>
  handlers ? handlers.apollo.request(operation, forward) : forward(operation),
);
