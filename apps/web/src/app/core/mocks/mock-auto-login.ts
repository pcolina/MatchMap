import { mockEnabled } from './mock-flag';

declare const MATCHMAP_AUTO_LOGIN: boolean | undefined;

export const autoLoginEnabled = mockEnabled && typeof MATCHMAP_AUTO_LOGIN !== 'undefined' && MATCHMAP_AUTO_LOGIN === true;
