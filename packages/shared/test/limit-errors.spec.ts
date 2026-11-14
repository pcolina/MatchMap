import { describe, expect, it } from 'vitest';
import { loginLimitErrorKey } from '../src/auth/limit-errors.ts';

describe('loginLimitErrorKey', () => {
  it.each([
    ['invalid_email', 'login.signIn.errorInvalidEmail'],
    ['email_too_long', 'login.signIn.errorEmailTooLong'],
    ['invalid_password', 'login.signIn.errorInvalidPassword'],
  ])('maps %s to its message key', (code, key) => {
    expect(loginLimitErrorKey(code)).toBe(key);
  });

  it.each(['invalid_credentials', 'too_many_attempts', 'server_error', '', 'constructor', 'toString'])('returns null for %j', (code) => {
    expect(loginLimitErrorKey(code)).toBeNull();
  });
});
