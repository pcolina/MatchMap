import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const catalogue = (language: string): Record<string, Record<string, Record<string, string>>> =>
  JSON.parse(readFileSync(resolve(__dirname, `../i18n/${language}.json`), 'utf8'));

describe('stats.resume.label', () => {
  it.each(['en', 'es'])('has a non-empty value in %s', (language) => {
    const value = catalogue(language)['stats']?.['resume']?.['label'];

    expect(typeof value).toBe('string');
    expect(value?.length).toBeGreaterThan(0);
  });
});
