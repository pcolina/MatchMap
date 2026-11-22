import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { mapColors } from '../../../../../../tokens/tokens.ts';
import { MapView } from './map-view';

type FakeStyle = { layers: { id: string; paint?: Record<string, unknown> }[] };
type FakeMapInstance = { options: { style: FakeStyle; attributionControl?: boolean }; setStyle: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };

const mapLibre = vi.hoisted(() => {
  const instances: FakeMapInstance[] = [];

  class FakeMap {
    setStyle = vi.fn();
    remove = vi.fn();

    constructor(public options: { style: FakeStyle }) {
      instances.push(this as unknown as FakeMapInstance);
    }
  }

  return { instances, FakeMap };
});

vi.mock('maplibre-gl', () => ({
  Map: mapLibre.FakeMap,
}));

describe('MapView', () => {
  let darkListener: ((event: { matches: boolean }) => void) | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    mapLibre.instances.length = 0;
    darkListener = undefined;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => (darkListener = listener),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates the map once with the day style', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapLibre.instances).toHaveLength(1);
    const background = mapLibre.instances[0].options.style.layers.find((layer) => layer.id === 'background');
    expect(background?.paint?.['background-color']).toBe(mapColors.light.ocean);
  });

  it('creates the map without the MapLibre attribution control, so the logo is not shown', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapLibre.instances[0].options.attributionControl).toBe(false);
  });

  it('rebuilds the style with the night colours when the system scheme changes', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();

    darkListener?.({ matches: true });
    fixture.detectChanges();
    TestBed.flushEffects();

    const map = mapLibre.instances[0];
    expect(map.setStyle).toHaveBeenCalledTimes(1);
    const style = map.setStyle.mock.calls[0][0] as { layers: { id: string; paint?: Record<string, unknown> }[] };
    expect(style.layers.find((layer) => layer.id === 'background')?.paint?.['background-color']).toBe(mapColors.dark.ocean);
  });

  it('exposes the map as an image with its translated name', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { map: { world: { label: 'World map' } } });
    translate.use('en');
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();

    const image = (fixture.nativeElement as HTMLElement).querySelector('[role="img"]');
    expect(image?.getAttribute('aria-label')).toBe('World map');
  });

  it('removes the map when it is destroyed', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.destroy();

    expect(mapLibre.instances[0].remove).toHaveBeenCalledTimes(1);
  });
});
