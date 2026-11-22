import { afterEach, describe, expect, it, vi } from 'vitest';

describe('autoLoginEnabled', () => {
  afterEach(() => {
    delete process.env['EXPO_PUBLIC_MATCHMAP_MOCKS'];
    delete process.env['EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN'];
    vi.resetModules();
  });

  it('is off when no flag is set', async () => {
    const { autoLoginEnabled } = await import('./mock-auto-login.ts');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is off when only the auto sign-in flag is set', async () => {
    process.env['EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN'] = 'true';
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login.ts');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is off when only the mock flag is set', async () => {
    process.env['EXPO_PUBLIC_MATCHMAP_MOCKS'] = 'true';
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login.ts');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is on when the mock flag and the auto sign-in flag are both true', async () => {
    process.env['EXPO_PUBLIC_MATCHMAP_MOCKS'] = 'true';
    process.env['EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN'] = 'true';
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login.ts');

    expect(autoLoginEnabled).toBe(true);
  });
});
