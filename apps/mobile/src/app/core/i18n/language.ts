export type Language = 'en' | 'es';

export const resolveLanguage = (deviceLocale: string | undefined): Language =>
  deviceLocale?.toLowerCase().split(/[-_]/)[0] === 'es' ? 'es' : 'en';

export const deviceLocale = (): string | undefined => Intl.DateTimeFormat().resolvedOptions().locale;
