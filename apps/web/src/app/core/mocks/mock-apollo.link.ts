import { ApolloLink, Observable } from '@apollo/client';
import type { FieldNode, OperationDefinitionNode } from 'graphql';
import { apiVersion, me, register } from '@matchmap/shared';
import { getMockState, mockContext, setMockState } from './mock-state';

const rootField = (query: { definitions: readonly unknown[] }): string => {
  const definition = query.definitions[0] as OperationDefinitionNode;
  return (definition.selectionSet.selections[0] as FieldNode).name.value;
};

const accessTokenFrom = (headers: Record<string, string> | undefined): string | undefined => {
  const value = headers?.['authorization'] ?? headers?.['Authorization'];
  return value?.startsWith('Bearer ') ? value.slice('Bearer '.length) : undefined;
};

export const mockApolloLink = new ApolloLink(
  (operation) =>
    new Observable((observer) => {
      const field = rootField(operation.query);
      const headers = operation.getContext()['headers'] as Record<string, string> | undefined;
      if (field === 'register') {
        const result = register(getMockState(), operation.variables['input'] as { email: string; password: string }, mockContext());
        setMockState(result.state);
        observer.next({ data: result.data, errors: result.errors });
      } else if (field === 'me') {
        const result = me(getMockState(), accessTokenFrom(headers));
        if (result.status === 401) {
          observer.error(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
          return;
        }
        observer.next({ data: result.data });
      } else if (field === 'apiVersion') {
        observer.next({ data: apiVersion().data });
      }
      observer.complete();
    }),
);
