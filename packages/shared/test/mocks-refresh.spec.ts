import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
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
  const result = signIn(createState(), { client: 'mobile', email: 'one@matchmap.test', password: 'One-pass1' }, context);
  return { state: result.state, refreshToken: (result.body as { refreshToken: string }).refreshToken };
};

describe('refresh', () => {
  it('returns new tokens and invalidates the refresh token it received', () => {
    const { state, refreshToken } = signedIn();

    const result = refresh(state, { client: 'mobile', refreshToken }, context);
    const reused = refresh(result.state, { client: 'mobile', refreshToken }, context);

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ tokenType: 'Bearer', accessToken: expect.any(String), refreshToken: expect.any(String) });
    expect((result.body as { refreshToken: string }).refreshToken).not.toBe(refreshToken);
    expect(reused.status).toBe(401);
    expect(reused.body).toEqual({ error: 'invalid_refresh_token' });
  });

  it('answers a second refresh with the same token with invalid_refresh_token', () => {
    const { state, refreshToken } = signedIn();
    const first = refresh(state, { client: 'mobile', refreshToken }, context);

    const second = refresh(first.state, { client: 'mobile', refreshToken }, context);

    expect(second.status).toBe(401);
    expect(second.body).toEqual({ error: 'invalid_refresh_token' });
  });

  it('rejects an unknown client with invalid_client', () => {
    const { state, refreshToken } = signedIn();

    const result = refresh(state, { client: 'desktop', refreshToken }, context);

    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'invalid_client' });
  });
});
