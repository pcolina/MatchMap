import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const requiredKeys = [
  'login.brand.tagline',
  'login.signIn.showPassword',
  'login.signIn.hidePassword',
  'login.signIn.emailLabel',
  'login.signIn.passwordLabel',
  'login.signIn.submit',
  'login.signIn.goToRegister',
  'login.signIn.languageSwitcher',
  'login.signIn.googleComingSoon',
  'login.signIn.errorEmailRequired',
  'login.signIn.errorEmailFormat',
  'login.signIn.errorEmailTooLong',
  'login.signIn.errorPasswordRequired',
  'login.signIn.errorPasswordLength',
  'login.signIn.errorInvalidCredentials',
  'login.signIn.errorTooManyAttempts',
  'login.common.errorNetwork',
  'login.common.errorUnknown',
];

const loadCatalogue = (locale: 'en' | 'es'): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(__dirname, `../i18n/${locale}.json`), 'utf8'));

const lookup = (catalogue: Record<string, unknown>, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object') {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, catalogue);

describe.each(['en', 'es'] as const)('%s sign-in catalogue', (locale) => {
  const catalogue = loadCatalogue(locale);

  it.each(requiredKeys)('has a non-empty value for %s', (key) => {
    const value = lookup(catalogue, key);
    expect(typeof value).toBe('string');
    expect((value as string).trim().length).toBeGreaterThan(0);
  });
});

describe('sign-in translations', () => {
  it('shows the approved copy for the validation messages in English', () => {
    const en = loadCatalogue('en');
    expect(lookup(en, 'login.signIn.errorEmailTooLong')).toBe('Email must be at most 254 characters.');
    expect(lookup(en, 'login.signIn.errorPasswordLength')).toBe('Password must be 6 to 20 characters.');
  });

  it('shows the approved copy for the Google button in Spanish', () => {
    expect(lookup(loadCatalogue('es'), 'login.signIn.googleComingSoon')).toBe('Próximamente');
  });
});
