import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createState } from '@matchmap/shared';

const key = 'matchmap.mock.state';

describe('mock state storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the state in local storage across a reload', async () => {
    const first = await import('./mock-state');
    first.setMockState({ ...createState(), failures: { 'x@matchmap.test': { windowStart: 1, count: 2 } } });

    vi.resetModules();
    const reloaded = await import('./mock-state');

    expect(reloaded.getMockState().failures['x@matchmap.test']).toEqual({ windowStart: 1, count: 2 });
    expect(localStorage.getItem(key)).not.toBeNull();
  });

  it('keeps the state in memory when local storage throws', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const mockState = await import('./mock-state');

    expect(() => mockState.setMockState({ ...createState(), refreshSessions: [] })).not.toThrow();
    expect(mockState.getMockState().users.length).toBeGreaterThan(0);
  });
});
