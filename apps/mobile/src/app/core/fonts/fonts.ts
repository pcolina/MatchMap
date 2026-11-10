import { typography } from '../theme/tokens.ts';
import { Caveat_600SemiBold } from '@expo-google-fonts/caveat';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';

export const appFonts = {
  Caveat_600SemiBold,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
};

const loadedNames: Record<string, Record<number, string>> = {
  Caveat: { 600: 'Caveat_600SemiBold' },
  Sora: { 600: 'Sora_600SemiBold', 700: 'Sora_700Bold', 800: 'Sora_800ExtraBold' },
  Inter: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
};

export const fontFamilyFor = (family: string, weight: number): string => {
  const name = loadedNames[family]?.[weight];
  if (name === undefined) {
    throw new Error(`${family} ${weight} is not loaded`);
  }
  return name;
};

export const textStyle = (name: keyof typeof typography) => {
  const token = typography[name];
  return {
    fontFamily: fontFamilyFor(token.family, token.weight),
    fontSize: token.size,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
  };
};
