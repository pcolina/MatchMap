import { afterEach, describe, expect, it, vi } from 'vitest';

describe('mockEnabled', () => {
  afterEach(() => {
    delete process.env['EXPO_PUBLIC_MATCHMAP_MOCKS'];
    vi.resetModules();
  });

  it('is off when the flag is not set', async () => {
    const { mockEnabled } = await import('./mock-flag.ts');

    expect(mockEnabled).toBe(false);
  });

  it('is on when the flag is set to true', async () => {
    process.env['EXPO_PUBLIC_MATCHMAP_MOCKS'] = 'true';
    vi.resetModules();
    const { mockEnabled } = await import('./mock-flag.ts');

    expect(mockEnabled).toBe(true);
  });
});
