import { afterEach, describe, expect, it, vi } from 'vitest';

type FlagGlobal = { MATCHMAP_MOCKS?: unknown; MATCHMAP_AUTO_LOGIN?: unknown };

describe('autoLoginEnabled', () => {
  afterEach(() => {
    delete (globalThis as FlagGlobal).MATCHMAP_MOCKS;
    delete (globalThis as FlagGlobal).MATCHMAP_AUTO_LOGIN;
    vi.resetModules();
  });

  it('is off when no flag is defined', async () => {
    const { autoLoginEnabled } = await import('./mock-auto-login');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is off when only the auto sign-in flag is defined', async () => {
    (globalThis as FlagGlobal).MATCHMAP_AUTO_LOGIN = true;
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is off when only the mock flag is defined', async () => {
    (globalThis as FlagGlobal).MATCHMAP_MOCKS = true;
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login');

    expect(autoLoginEnabled).toBe(false);
  });

  it('is on when the mock flag and the auto sign-in flag are both true', async () => {
    (globalThis as FlagGlobal).MATCHMAP_MOCKS = true;
    (globalThis as FlagGlobal).MATCHMAP_AUTO_LOGIN = true;
    vi.resetModules();
    const { autoLoginEnabled } = await import('./mock-auto-login');

    expect(autoLoginEnabled).toBe(true);
  });
});
