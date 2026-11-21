import type { MockHttpResult } from './sign-in.ts';
import type { MockContext, MockState } from './types.ts';

export type LogoutInput = {
  client: string | undefined;
  refreshToken: string | undefined;
};

export const logout = (state: MockState, input: LogoutInput, _context: MockContext): MockHttpResult => {
  if (input.client !== 'web' && input.client !== 'mobile') {
    return { status: 400, body: { error: 'invalid_client' }, state };
  }
  return {
    status: 204,
    state: {
      ...state,
      refreshSessions: state.refreshSessions.map((session) =>
        session.token === input.refreshToken ? { ...session, revoked: true } : session,
      ),
    },
  };
};
