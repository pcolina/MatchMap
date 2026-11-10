import { describe, expect, it } from 'vitest';
import { normalizeEmail, validateSignInEmail, validateSignInPassword } from '../src/auth/validators';

describe('validateSignInEmail', () => {
  it('rejects an empty email and an email with only spaces', () => {
    expect(validateSignInEmail('')).toBe('login.signIn.errorEmailRequired');
    expect(validateSignInEmail('   ')).toBe('login.signIn.errorEmailRequired');
  });

  it('rejects an email that is not in standard format', () => {
    expect(validateSignInEmail('user@example')).toBe('login.signIn.errorEmailFormat');
    expect(validateSignInEmail('userexample.com')).toBe('login.signIn.errorEmailFormat');
    expect(validateSignInEmail('user @example.com')).toBe('login.signIn.errorEmailFormat');
  });

  it('rejects an email longer than 254 characters', () => {
    const tooLong = `${'a'.repeat(243)}@example.com`;
    expect(tooLong).toHaveLength(255);
    expect(validateSignInEmail(tooLong)).toBe('login.signIn.errorEmailTooLong');
  });

  it('accepts an email of exactly 254 characters', () => {
    const maximum = `${'a'.repeat(242)}@example.com`;
    expect(maximum).toHaveLength(254);
    expect(validateSignInEmail(maximum)).toBeNull();
  });

  it('accepts a valid email, ignoring surrounding spaces and capitals', () => {
    expect(validateSignInEmail('user@example.com')).toBeNull();
    expect(validateSignInEmail(' User@Example.com ')).toBeNull();
  });
});

describe('validateSignInPassword', () => {
  it('rejects an empty password', () => {
    expect(validateSignInPassword('')).toBe('login.signIn.errorPasswordRequired');
  });

  it('rejects a password shorter than 6 or longer than 20 characters', () => {
    expect(validateSignInPassword('12345')).toBe('login.signIn.errorPasswordLength');
    expect(validateSignInPassword('a'.repeat(21))).toBe('login.signIn.errorPasswordLength');
  });

  it('accepts a password of 6 to 20 characters', () => {
    expect(validateSignInPassword('123456')).toBeNull();
    expect(validateSignInPassword('a'.repeat(20))).toBeNull();
  });

  it('does not apply the registration complexity rules', () => {
    expect(validateSignInPassword('abcdef')).toBeNull();
    expect(validateSignInPassword('abcdefgh1')).toBeNull();
  });
});

describe('normalizeEmail', () => {
  it('trims and lower-cases the email', () => {
    expect(normalizeEmail(' User@Example.com ')).toBe('user@example.com');
  });
});
