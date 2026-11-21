import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { logout } from '../src/mocks/logout';
import { refresh } from '../src/mocks/refresh';
import { signIn } from '../src/mocks/sign-in';
import type { MockContext } from '../src/mocks/types';

let counter = 0;
const context: MockContext = {
  now: 1_000_000,
  random: (length) => {
    counter += 1;
    return `t${counter}`.padEnd(length, 'x');
  },
};

const signedIn = () => {
  const result = signIn(createState(), { client: 'mobile', email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);
  return { state: result.state, refreshToken: (result.body as { refreshToken: string }).refreshToken };
};

describe('logout', () => {
  it('revokes the session so its refresh token no longer works', () => {
    const { state, refreshToken } = signedIn();

    const result = logout(state, { client: 'mobile', refreshToken }, context);
    const afterLogout = refresh(result.state, { client: 'mobile', refreshToken }, context);

    expect(result.status).toBe(204);
    expect(afterLogout.status).toBe(401);
    expect(afterLogout.body).toEqual({ error: 'invalid_refresh_token' });
  });

  it('returns 204 for a token the mock does not know', () => {
    const result = logout(createState(), { client: 'mobile', refreshToken: 'unknown' }, context);

    expect(result.status).toBe(204);
  });

  it('returns 204 when the refresh token is missing', () => {
    const result = logout(createState(), { client: 'web', refreshToken: undefined }, context);

    expect(result.status).toBe(204);
  });
});
