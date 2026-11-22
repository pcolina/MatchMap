import { ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const apolloAuthLink = (accessToken: () => string | null): ApolloLink =>
  setContext((_, { headers }) => {
    const token = accessToken();
    return { headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers };
  });
