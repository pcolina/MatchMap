import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const keys = ['close', 'blocks.account', 'blocks.settings', 'blocks.about', 'blocks.session', 'profile', 'language', 'theme', 'aboutItem', 'signOut'];

const lookup = (catalogue: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), catalogue);

describe('account sheet translations', () => {
  it.each(keys)('has account.sheet.%s in English and Spanish, non-empty', (key) => {
    const enValue = lookup(en, `account.sheet.${key}`);
    const esValue = lookup(es, `account.sheet.${key}`);

    expect(typeof enValue).toBe('string');
    expect((enValue as string).trim().length).toBeGreaterThan(0);
    expect(typeof esValue).toBe('string');
    expect((esValue as string).trim().length).toBeGreaterThan(0);
  });
});
