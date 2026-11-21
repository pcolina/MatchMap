import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { signIn } from '../src/mocks/sign-in';
import type { MockContext } from '../src/mocks/types';

const context: MockContext = { now: 1_000_000, random: (length) => 'x'.repeat(length) };

describe('signIn success', () => {
  it('returns the token response for the web client without a refresh token in the body', () => {
    const result = signIn(createState(), { client: 'web', email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ tokenType: 'Bearer', expiresIn: 900 });
    expect(result.body).toHaveProperty('accessToken');
    expect(result.body).not.toHaveProperty('refreshToken');
    expect(result.refreshToken).toBeDefined();
  });

  it('normalises the email before the comparison', () => {
    const result = signIn(createState(), { client: 'web', email: '  Mock@MatchMap.test ', password: 'Mock-pass1' }, context);

    expect(result.status).toBe(200);
  });

  it('returns the refresh token in the body for the mobile client', () => {
    const result = signIn(createState(), { client: 'mobile', email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ refreshToken: expect.any(String) });
  });
});
