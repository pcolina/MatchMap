import { describe, expect, it } from 'vitest';
import { apiVersion, me } from '../src/mocks/account';
import { createState } from '../src/mocks/state';
import { signIn } from '../src/mocks/sign-in';
import type { MockContext } from '../src/mocks/types';

const context: MockContext = { now: 1_000_000, random: (length) => 'x'.repeat(length) };

const accessTokenOf = (email: string, password: string) => {
  const result = signIn(createState(), { client: 'web', email, password }, context);
  return (result.body as { accessToken: string }).accessToken;
};

describe('me', () => {
  it('returns the id, email, username and createdAt of the signed-in user', () => {
    const state = createState();
    const token = accessTokenOf('mock@matchmap.test', 'Mock-pass1');

    const result = me(state, token);

    expect(result.status).toBe(200);
    expect(result.data?.me).toEqual({
      id: state.users[0].id,
      email: 'mock@matchmap.test',
      username: 'mock',
      createdAt: state.users[0].createdAt,
    });
  });

  it('fails with 401 when there is no access token', () => {
    const result = me(createState(), undefined);

    expect(result.status).toBe(401);
    expect(result.data).toBeUndefined();
  });
});

describe('apiVersion', () => {
  it('returns the project version', () => {
    expect(apiVersion().data?.apiVersion).toBe('0.1.0-SNAPSHOT');
  });
});
