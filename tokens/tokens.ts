// matchMap design tokens — Atlas nocturno v1.0.0
// Generated from tokens.json. Do not hard-code colours or sizes in components: import from here.

export const colors = {
  light: {
    accent: '#0F7C80',
    onAccent: '#FFFFFF',
    accentSubtle: '#D5EFED',
    bg: '#F2F4F8',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    text: '#111827',
    textSecondary: '#4B5563',
    border: '#E1E5EC',
    borderStrong: '#C3CCD9',
    success: '#15803D',
    warning: '#B45309',
    danger: '#B91C1C',
    onDanger: '#FFFFFF',
    info: '#1D4ED8',
  },
  dark: {
    accent: '#2DD4BF',
    onAccent: '#04201C',
    accentSubtle: '#0E3B3A',
    bg: '#0A0F1C',
    surface: '#121A2B',
    surfaceRaised: '#18223A',
    text: '#EEF2F8',
    textSecondary: '#9AA6BA',
    border: '#222C40',
    borderStrong: '#3B4660',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
    onDanger: '#0A0F1C',
    info: '#60A5FA',
  },
} as const;

export const mapColors = {
  light: {
    ocean: '#CCD7E6',
    land: '#E8ECF2',
    countryBorder: '#FFFFFF',
    visited: '#0F7C80',
    lived: '#0A5458',
    wantToGo: '#E3F4F2',
    compareBoth: '#0F7C80',
    compareOnlyMe: '#98D5D0',
    compareOnlyFriend: '#A9B3C2',
    excludedVisited: '#CBD2DD',
    score1: '#D5EFED',
    score2: '#A6DCD7',
    score3: '#4FB3AE',
    score4: '#1A8F92',
    score5: '#0F7C80',
  },
  dark: {
    ocean: '#0A1324',
    land: '#1D2638',
    countryBorder: '#0A1324',
    visited: '#2DD4BF',
    lived: '#99F6E4',
    wantToGo: '#0C3432',
    compareBoth: '#2DD4BF',
    compareOnlyMe: '#12665D',
    compareOnlyFriend: '#3B4660',
    excludedVisited: '#2B3448',
    score1: '#0E3B3A',
    score2: '#16776F',
    score3: '#169184',
    score4: '#22B8A6',
    score5: '#2DD4BF',
  },
} as const;

export const fonts = {
  display: { 600: 'Sora_600SemiBold', 700: 'Sora_700Bold', 800: 'Sora_800ExtraBold' },
  body: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
} as const;

export const typography = {
  counter: {
    family: 'Sora',
    weight: 800,
    size: 48,
    lineHeight: 52,
    letterSpacing: -1,
  },
  display: {
    family: 'Sora',
    weight: 800,
    size: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title1: {
    family: 'Sora',
    weight: 700,
    size: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  title2: {
    family: 'Sora',
    weight: 700,
    size: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  title3: {
    family: 'Sora',
    weight: 600,
    size: 17,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    family: 'Inter',
    weight: 400,
    size: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyStrong: {
    family: 'Inter',
    weight: 600,
    size: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  callout: {
    family: 'Inter',
    weight: 400,
    size: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  label: {
    family: 'Inter',
    weight: 600,
    size: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    family: 'Inter',
    weight: 500,
    size: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  button: {
    family: 'Inter',
    weight: 700,
    size: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export const space = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
  pill: 999,
} as const;

export const motion = {
  fast: 150,
  base: 250,
  slow: 400,
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const size = {
  touchTargetMin: 44,
  buttonHeight: 52,
  inputHeight: 48,
  tabBarHeight: 56,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
} as const;

export type ColorScheme = 'light' | 'dark';
export type ColorToken = keyof typeof colors.light;
export type MapColorToken = keyof typeof mapColors.light;
