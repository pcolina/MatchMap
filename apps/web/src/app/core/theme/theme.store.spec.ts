import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme.store';

const storageKey = 'matchmap.theme';

const stubSystemDark = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );

const fresh = () => {
  TestBed.resetTestingModule();
  return TestBed.inject(ThemeStore);
};

describe('ThemeStore', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('follows the system mode when no choice is saved', () => {
    stubSystemDark(true);

    const store = fresh();

    expect(store.choice()).toBe('system');
    expect(store.isDark()).toBe(true);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('keeps a chosen mode in the device storage, so a new store reads it back', () => {
    stubSystemDark(false);
    fresh().toggle();

    expect(localStorage.getItem(storageKey)).toBe('dark');
    expect(fresh().isDark()).toBe(true);
  });

  it('flips the shown mode on toggle and sets the root theme attribute to match', () => {
    stubSystemDark(true);
    const store = fresh();

    store.toggle();

    expect(store.isDark()).toBe(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('keeps the choice in memory when the device storage fails', () => {
    stubSystemDark(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const store = fresh();

    store.toggle();

    expect(store.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
