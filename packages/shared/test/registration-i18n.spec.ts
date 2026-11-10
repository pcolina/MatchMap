import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const specPath = resolve(__dirname, '../../../openspec/changes/add-registration-page/specs/client-registration/spec.md');
const proposalPath = resolve(__dirname, '../../../openspec/changes/add-registration-page/proposal.md');

const loadCatalogue = (locale: 'en' | 'es'): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(__dirname, `../i18n/${locale}.json`), 'utf8'));

const lookup = (catalogue: Record<string, unknown>, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object') {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, catalogue);

const registerKeysInSpec = [
  ...new Set(readFileSync(specPath, 'utf8').match(/login\.register\.[A-Za-z]+/g) ?? []),
];

const approvedCopy: Record<string, { en: string; es: string }> = {
  'login.register.title': { en: 'Create account', es: 'Crear cuenta' },
  'login.register.emailLabel': { en: 'Email', es: 'Email' },
  'login.register.passwordLabel': { en: 'Password', es: 'Contraseña' },
  'login.register.repeatPasswordLabel': { en: 'Repeat password', es: 'Repetir contraseña' },
  'login.register.errorPasswordMismatch': { en: 'Passwords do not match.', es: 'Las contraseñas no coinciden.' },
  'login.register.submit': { en: 'Create account', es: 'Crear cuenta' },
  'login.register.goToSignIn': {
    en: 'Already have an account? Sign in',
    es: '¿Ya tienes cuenta? Iniciar sesión',
  },
  'login.register.errorEmailTaken': {
    en: 'An account with this email already exists.',
    es: 'Ya existe una cuenta con este email.',
  },
  'login.register.errorPasswordInvalid': {
    en: 'Use 6 to 20 characters, with a lowercase letter, an uppercase letter and a special character.',
    es: 'Usa de 6 a 20 caracteres, con una letra minúscula, una mayúscula y un carácter especial.',
  },
  'login.register.errorSignInAfterRegister': {
    en: 'Your account was created, but we could not sign you in. Sign in again.',
    es: 'Tu cuenta se ha creado, pero no hemos podido iniciar sesión. Inicia sesión de nuevo.',
  },
};

describe('registration keys used in the spec', () => {
  it('finds the registration keys in the spec', () => {
    expect(registerKeysInSpec.length).toBeGreaterThan(0);
  });

  it.each(registerKeysInSpec)('is in the approved copy list: %s', (key) => {
    expect(approvedCopy).toHaveProperty([key]);
  });
});

describe.each(['en', 'es'] as const)('%s registration catalogue', (locale) => {
  const catalogue = loadCatalogue(locale);

  it.each(Object.keys(approvedCopy))('has a non-empty value for %s', (key) => {
    const value = lookup(catalogue, key);
    expect(typeof value).toBe('string');
    expect((value as string).trim().length).toBeGreaterThan(0);
  });

  it.each(Object.keys(approvedCopy))('shows the approved copy for %s', (key) => {
    expect(lookup(catalogue, key)).toBe(approvedCopy[key][locale]);
  });
});

describe('registration proposal copy', () => {
  it('lists every approved key in the proposal', () => {
    const proposal = readFileSync(proposalPath, 'utf8');
    for (const key of Object.keys(approvedCopy)) {
      expect(proposal).toContain(`\`${key}\``);
    }
  });
});
