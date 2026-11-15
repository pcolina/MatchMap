import { InMemoryCache } from '@apollo/client/cache';
import type { HttpLink } from 'apollo-angular/http';
import { graphqlUrl } from './api-url.ts';

export const apolloOptions = (httpLink: HttpLink, base: string) => ({
  link: httpLink.create({ uri: graphqlUrl(base) }),
  cache: new InMemoryCache(),
});
