import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ThemeStore } from '../../core/theme/theme.store';
import { MapView } from './map-view';
import { buildMapStyle } from './map-view.style';

const recorded = vi.hoisted(() => ({
  created: [] as Array<{ style: unknown }>,
  setStyle: [] as unknown[],
}));

vi.mock('maplibre-gl', () => ({
  Map: class {
    constructor(options: { style: unknown }) {
      recorded.created.push({ style: options.style });
    }
    setStyle(style: unknown) {
      recorded.setStyle.push(style);
    }
    setMinZoom() {}
    remove() {}
  },
}));

const stubSystemDark = (matches: boolean) =>
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );

describe('MapView follows the day or night mode of the app', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    recorded.created.length = 0;
    recorded.setStyle.length = 0;
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('draws the map in night colours after the app switches to dark mode', async () => {
    stubSystemDark(false);
    localStorage.setItem('matchmap.theme', 'light');
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => expect(recorded.created).toHaveLength(1));

    TestBed.inject(ThemeStore).toggle();
    fixture.detectChanges();

    await vi.waitFor(() => expect(recorded.setStyle.at(-1)).toEqual(buildMapStyle({}, 'night')));
  });

  it('draws the map in day colours when the app is in light mode, even if the system is dark', async () => {
    stubSystemDark(true);
    localStorage.setItem('matchmap.theme', 'light');
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.waitFor(() => expect(recorded.created.at(-1)?.style).toEqual(buildMapStyle({}, 'day')));
  });
});
