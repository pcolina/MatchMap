import { mockEnabled } from './mock-flag.ts';

export const autoLoginEnabled = mockEnabled && process.env['EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN'] === 'true';
