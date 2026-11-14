import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const specPath = resolve(__dirname, '../../../openspec/changes/add-login-input-errors/specs/client-sign-in/spec.md');

const messages = Object.fromEntries(
  readFileSync(specPath, 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('| `login.signIn.'))
    .map((line) => {
      const [key, english, spanish] = line.split('|').slice(1, 4).map((cell) => cell.trim());
      return [key.replace(/`/g, ''), { en: english, es: spanish }];
    }),
);

const lookup = (catalogue: unknown, dotted: string): unknown =>
  dotted.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), catalogue);

describe('login limit error messages', () => {
  it('lists the two new keys in the change spec', () => {
    expect(Object.keys(messages).sort()).toEqual(['login.signIn.errorEmailTooLong', 'login.signIn.errorInvalidEmail', 'login.signIn.errorInvalidPassword']);
  });

  it.each(Object.keys(messages))('%s has the approved English and Spanish text', (key) => {
    expect(lookup(en, key)).toBe(messages[key].en);
    expect(lookup(es, key)).toBe(messages[key].es);
  });
});
