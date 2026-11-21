import { issueTokens, type MockHttpResult } from './sign-in.ts';
import type { MockClient, MockContext, MockState } from './types.ts';

export type RefreshInput = {
  client: string | undefined;
  refreshToken: string | undefined;
};

export const refresh = (state: MockState, input: RefreshInput, context: MockContext): MockHttpResult => {
  if (input.client !== 'web' && input.client !== 'mobile') {
    return { status: 400, body: { error: 'invalid_client' }, state };
  }
  const session = state.refreshSessions.find((candidate) => candidate.token === input.refreshToken && !candidate.revoked);
  const user = session && state.users.find((candidate) => candidate.id === session.userId);
  if (!session || !user) {
    return { status: 401, body: { error: 'invalid_refresh_token' }, state };
  }
  const revoked: MockState = {
    ...state,
    refreshSessions: state.refreshSessions.map((candidate) =>
      candidate === session ? { ...candidate, revoked: true } : candidate,
    ),
  };
  const issued = issueTokens(revoked, user, input.client as MockClient, context);
  return { status: 200, body: issued.body, refreshToken: issued.refreshToken, state: issued.state };
};
