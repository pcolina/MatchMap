import { describe, expect, it } from 'vitest';
import { validateRegisterPassword } from '../src/index.ts';

const owaspSpecials = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split('');

describe('validateRegisterPassword', () => {
  it('accepts a password of 6 to 20 characters with a lowercase letter, an uppercase letter and a special character', () => {
    expect(validateRegisterPassword('Abc!12')).toBeNull();
    expect(validateRegisterPassword(`Aa!${'b'.repeat(17)}`)).toBeNull();
  });

  it('rejects a password shorter than 6 characters', () => {
    expect(validateRegisterPassword('Abc!1')).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects a password longer than 20 characters', () => {
    expect(validateRegisterPassword(`Aa!${'b'.repeat(18)}`)).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects an empty password', () => {
    expect(validateRegisterPassword('')).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects a password without a lowercase letter', () => {
    expect(validateRegisterPassword('ABC!12')).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects a password without an uppercase letter', () => {
    expect(validateRegisterPassword('abc!12')).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects a password without a special character, because letters and digits are not special', () => {
    expect(validateRegisterPassword('Abc123')).toBe('login.register.errorPasswordInvalid');
  });

  it('rejects a password with a whitespace character', () => {
    expect(validateRegisterPassword('Ab c!1')).toBe('login.register.errorPasswordInvalid');
  });

  it.each(owaspSpecials)('accepts the special character %s', (special) => {
    expect(validateRegisterPassword(`Abc12${special}`)).toBeNull();
  });
});
