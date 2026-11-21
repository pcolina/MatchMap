import { normalizeEmail } from '../auth/validators.ts';
import type { MockContext, MockClient, MockState, MockUser } from './types.ts';

export type SignInInput = {
  client: string | undefined;
  email: string;
  password: string;
};

export type TokenBody = {
  tokenType: 'Bearer';
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
};

export type MockHttpResult = {
  status: number;
  body?: unknown;
  retryAfterSeconds?: number;
  refreshToken?: string;
  state: MockState;
};

const accessTokenExpiresIn = 900;

export const issueTokens = (
  state: MockState,
  user: MockUser,
  client: MockClient,
  context: MockContext,
): { body: TokenBody; refreshToken: string; state: MockState } => {
  const refreshToken = context.random(40);
  const body: TokenBody = {
    tokenType: 'Bearer',
    accessToken: `mock.${user.id}.${context.random(32)}`,
    expiresIn: accessTokenExpiresIn,
  };
  if (client === 'mobile') {
    body.refreshToken = refreshToken;
  }
  return {
    body,
    refreshToken,
    state: {
      ...state,
      refreshSessions: [...state.refreshSessions, { token: refreshToken, userId: user.id, revoked: false }],
    },
  };
};

export const signIn = (state: MockState, input: SignInInput, context: MockContext): MockHttpResult => {
  const email = normalizeEmail(input.email);
  const user = state.users.find((candidate) => candidate.email === email && candidate.password === input.password);
  if (!user) {
    return { status: 401, body: { error: 'invalid_credentials' }, state };
  }
  const issued = issueTokens(state, user, input.client as MockClient, context);
  return { status: 200, body: issued.body, refreshToken: issued.refreshToken, state: issued.state };
};
