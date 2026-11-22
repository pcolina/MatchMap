import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const keys = ['addPlace', 'friends', 'account', 'attribution', 'globe', 'mercator'];

describe('map controls translations', () => {
  it.each(keys)('has the %s key in English and Spanish, non-empty', (key) => {
    const enValue = (en as Record<string, Record<string, Record<string, string>>>)['map']?.['controls']?.[key];
    const esValue = (es as Record<string, Record<string, Record<string, string>>>)['map']?.['controls']?.[key];

    expect(typeof enValue).toBe('string');
    expect(enValue?.trim().length).toBeGreaterThan(0);
    expect(typeof esValue).toBe('string');
    expect(esValue?.trim().length).toBeGreaterThan(0);
  });
});
