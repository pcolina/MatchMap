import { expect, test } from 'vitest';
import { resolveLanguage } from './language.ts';

test('selects Spanish for a Spanish device locale', () => {
  expect(resolveLanguage('es-ES')).toBe('es');
  expect(resolveLanguage('es')).toBe('es');
});

test('selects English for any other device locale', () => {
  expect(resolveLanguage('en-US')).toBe('en');
  expect(resolveLanguage('fr-FR')).toBe('en');
});

test('selects English when the device locale is unknown', () => {
  expect(resolveLanguage(undefined)).toBe('en');
  expect(resolveLanguage('')).toBe('en');
});
