import responses from './data/responses.json';
import type { GraphqlResult, PublicUser } from './register.ts';
import type { MockState } from './types.ts';

export type HttpLikeResult<T> = GraphqlResult<T> & { status: number };

const userIdFromToken = (token: string | undefined): string | null => {
  if (!token?.startsWith('mock.')) {
    return null;
  }
  return token.split('.')[1] ?? null;
};

export const me = (state: MockState, accessToken: string | undefined): HttpLikeResult<{ me: PublicUser }> => {
  const userId = userIdFromToken(accessToken);
  const user = userId && state.users.find((candidate) => candidate.id === userId);
  if (!user) {
    return { status: 401, state };
  }
  return {
    status: 200,
    data: { me: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt } },
    state,
  };
};

export const apiVersion = (): { status: number; data: { apiVersion: string } } => ({
  status: 200,
  data: { apiVersion: responses.apiVersion },
});
