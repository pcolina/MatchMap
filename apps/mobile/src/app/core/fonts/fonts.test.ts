import { describe, expect, test, vi } from 'vitest';
import { typography } from '../theme/tokens.ts';
import { appFonts, fontFamilyFor, textStyle } from './fonts.ts';

vi.mock('@expo-google-fonts/caveat', () => ({ Caveat_600SemiBold: 'caveat-600' }));
vi.mock('@expo-google-fonts/sora', () => ({ Sora_600SemiBold: 's600', Sora_700Bold: 's700', Sora_800ExtraBold: 's800' }));
vi.mock('@expo-google-fonts/inter', () => ({
  Inter_400Regular: 'i400',
  Inter_500Medium: 'i500',
  Inter_600SemiBold: 'i600',
  Inter_700Bold: 'i700',
}));

describe('fonts', () => {
  test('maps each family and weight to its loaded font name', () => {
    expect(fontFamilyFor('Sora', 800)).toBe('Sora_800ExtraBold');
    expect(fontFamilyFor('Inter', 400)).toBe('Inter_400Regular');
    expect(fontFamilyFor('Caveat', 600)).toBe('Caveat_600SemiBold');
  });

  test('rejects a family and weight that is not loaded', () => {
    expect(() => fontFamilyFor('Sora', 400)).toThrow('Sora 400 is not loaded');
  });

  test('loads every font the design tokens use', () => {
    for (const entry of Object.values(typography)) {
      expect(Object.keys(appFonts)).toContain(fontFamilyFor(entry.family, entry.weight));
    }
  });
});

describe('text styles', () => {
  test('gives the button text its font, size and line height from the tokens', () => {
    expect(textStyle('button')).toEqual({ fontFamily: 'Inter_700Bold', fontSize: 16, lineHeight: 20, letterSpacing: 0 });
  });

  test('gives captions and labels their own font and size', () => {
    expect(textStyle('caption')).toEqual({ fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.2 });
    expect(textStyle('label')).toEqual({ fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20, letterSpacing: 0 });
  });

  test('gives body text the regular Inter face', () => {
    expect(textStyle('body')).toEqual({ fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, letterSpacing: 0 });
  });
});
