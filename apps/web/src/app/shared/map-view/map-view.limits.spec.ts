import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MapView } from './map-view';

type FakeMapInstance = {
  options: { minZoom?: number; maxBounds?: number[][] };
  setMinZoom: ReturnType<typeof vi.fn>;
  setMaxBounds: ReturnType<typeof vi.fn>;
  setStyle: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

const mapLibre = vi.hoisted(() => {
  const instances: FakeMapInstance[] = [];

  class FakeMap {
    setMinZoom = vi.fn();
    setMaxBounds = vi.fn();
    setStyle = vi.fn();
    remove = vi.fn();

    constructor(public options: { minZoom?: number; maxBounds?: number[][] }) {
      instances.push(this as unknown as FakeMapInstance);
    }
  }

  return { instances, FakeMap };
});

vi.mock('maplibre-gl', () => ({
  Map: mapLibre.FakeMap,
}));

const resizeCallbacks: ((entries: { contentRect: { width: number } }[]) => void)[] = [];

const MERCATOR_BOUNDS = [
  [-180, -60],
  [180, 85],
];

const expectedGlobeMinZoom = (width: number) => Math.log2(((width - 8) * Math.PI) / 512);

const settle = async (fixture: { whenStable: () => Promise<unknown> }) => {
  await fixture.whenStable();
  await vi.waitFor(() => expect(mapLibre.instances.length).toBeGreaterThan(0));
};

const resize = (width: number) => {
  for (const callback of resizeCallbacks) {
    callback([{ contentRect: { width } }]);
  }
};

describe('MapView limits', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    mapLibre.instances.length = 0;
    resizeCallbacks.length = 0;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: (entries: { contentRect: { width: number } }[]) => void) {
          resizeCallbacks.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates the Mercator map with minimum zoom 3 and the bounds that keep Antarctica out', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await settle(fixture);

    expect(mapLibre.instances[0].options.minZoom).toBe(3);
    expect(mapLibre.instances[0].options.maxBounds).toEqual(MERCATOR_BOUNDS);
  });

  it('sets the globe minimum zoom from the container width: about 1.24 at 390 px and about 2.64 at 1024 px', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resize(390);
    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expectedGlobeMinZoom(390));
    expect(expectedGlobeMinZoom(390).toFixed(2)).toBe('1.23');

    resize(1024);
    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expectedGlobeMinZoom(1024));
    expect(expectedGlobeMinZoom(1024).toFixed(2)).toBe('2.64');
  });

  it('uses a minimum zoom of 0 for a container of 8 px or less', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resize(8);
    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(0);
  });

  it('restores minimum zoom 3 and the Mercator bounds when the projection goes back to Mercator', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    fixture.componentRef.setInput('projection', 'mercator');
    fixture.detectChanges();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(3);
    expect(mapLibre.instances[0].setMaxBounds).toHaveBeenLastCalledWith(MERCATOR_BOUNDS);
  });
});
