import { afterEach, describe, expect, it, vi } from 'vitest';

type FlagGlobal = { MATCHMAP_MOCKS?: unknown };

describe('mockEnabled', () => {
  afterEach(() => {
    delete (globalThis as FlagGlobal).MATCHMAP_MOCKS;
    vi.resetModules();
  });

  it('is off when the flag is not defined', async () => {
    const { mockEnabled } = await import('./mock-flag');

    expect(mockEnabled).toBe(false);
  });

  it('is on when the flag is defined as true', async () => {
    (globalThis as FlagGlobal).MATCHMAP_MOCKS = true;
    vi.resetModules();
    const { mockEnabled } = await import('./mock-flag');

    expect(mockEnabled).toBe(true);
  });
});
