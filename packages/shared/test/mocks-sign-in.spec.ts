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

  it('answers a wrong password and an unknown email with the same invalid_credentials response', () => {
    const wrongPassword = signIn(createState(), { client: 'web', email: 'mock@matchmap.test', password: 'Wrong-pass1' }, context);
    const unknownEmail = signIn(createState(), { client: 'web', email: 'nobody@matchmap.test', password: 'Mock-pass1' }, context);

    expect(wrongPassword.status).toBe(401);
    expect(wrongPassword.body).toEqual({ error: 'invalid_credentials' });
    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body).toEqual({ error: 'invalid_credentials' });
  });

  it('rejects an email that is not in standard format with invalid_email', () => {
    const result = signIn(createState(), { client: 'web', email: 'not-an-email', password: 'Mock-pass1' }, context);

    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'invalid_email' });
  });

  it('rejects an email longer than 254 characters with email_too_long', () => {
    const email = `${'a'.repeat(250)}@m.test`;

    const result = signIn(createState(), { client: 'web', email, password: 'Mock-pass1' }, context);

    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'email_too_long' });
  });

  it('rejects a missing or unknown client with invalid_client', () => {
    const missing = signIn(createState(), { client: undefined, email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);
    const unknown = signIn(createState(), { client: 'desktop', email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);

    expect(missing.status).toBe(400);
    expect(missing.body).toEqual({ error: 'invalid_client' });
    expect(unknown.status).toBe(400);
    expect(unknown.body).toEqual({ error: 'invalid_client' });
  });

  it('rejects a password outside its limits with invalid_password', () => {
    const result = signIn(createState(), { client: 'web', email: 'mock@matchmap.test', password: 'Abc12' }, context);

    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'invalid_password' });
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
