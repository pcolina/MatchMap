import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { register } from '../src/mocks/register';
import type { MockContext } from '../src/mocks/types';

const context: MockContext = { now: Date.UTC(2026, 0, 2), random: (length) => 'r'.repeat(length) };

describe('register', () => {
  it('creates the user and returns the User fields', () => {
    const result = register(createState(), { email: 'fresh@matchmap.test', password: 'Fresh-pass1' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data?.register).toMatchObject({
      id: expect.any(String),
      email: 'fresh@matchmap.test',
      username: expect.any(String),
      createdAt: new Date(context.now).toISOString(),
    });
    expect(result.state.users.map((user) => user.email)).toContain('fresh@matchmap.test');
  });

  it('returns VALIDATION_FAILED on the email field for an empty email', () => {
    const result = register(createState(), { email: '', password: 'Fresh-pass1' }, context);

    expect(result.data).toBeUndefined();
    expect(result.errors?.[0].extensions).toEqual({ code: 'VALIDATION_FAILED', field: 'email' });
  });

  it('returns PASSWORD_INVALID on the password field for a password that breaks the rule', () => {
    const result = register(createState(), { email: 'fresh@matchmap.test', password: 'abcdef' }, context);

    expect(result.data).toBeUndefined();
    expect(result.errors?.[0].extensions).toEqual({ code: 'PASSWORD_INVALID', field: 'password' });
  });

  it('stores the email trimmed and lower-cased', () => {
    const result = register(createState(), { email: 'New.User@MatchMap.test', password: 'Fresh-pass1' }, context);

    expect(result.data?.register.email).toBe('new.user@matchmap.test');
  });
});
