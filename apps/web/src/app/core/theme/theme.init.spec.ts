import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTheme } from './theme.init';

describe('theme at app start', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('applies the saved mode at app start, before any component asks for it', async () => {
    localStorage.setItem('matchmap.theme', 'dark');
    TestBed.configureTestingModule({ providers: [provideTheme()] });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
