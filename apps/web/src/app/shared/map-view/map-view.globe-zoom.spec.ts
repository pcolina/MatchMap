import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MapView } from './map-view';

type ResizeCallback = () => void;
type FakeMapInstance = { setMinZoom: ReturnType<typeof vi.fn> };

const mapLibre = vi.hoisted(() => {
  const instances: FakeMapInstance[] = [];

  class FakeMap {
    setStyle = vi.fn();
    setMinZoom = vi.fn();
    remove = vi.fn();
    on = vi.fn();
    project = vi.fn(() => ({ x: 0, y: 0 }));
    getBounds = vi.fn(() => ({ getSouth: () => -40 }));
    getCenter = vi.fn(() => ({ lng: 0, lat: 42 }));
    easeTo = vi.fn();

    constructor() {
      instances.push(this as unknown as FakeMapInstance);
    }
  }

  return { instances, FakeMap };
});

const resizeCallbacks = vi.hoisted(() => [] as ResizeCallback[]);

class FakeResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: ResizeCallback) {
    resizeCallbacks.push(callback);
  }
}

vi.mock('maplibre-gl', () => ({
  Map: mapLibre.FakeMap,
}));

const settle = async (fixture: { whenStable: () => Promise<unknown> }) => {
  await fixture.whenStable();
  await vi.waitFor(() => expect(mapLibre.instances.length).toBeGreaterThan(0));
};

const containerWidth = (px: number) => vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(px);

const globeMinZoomFor = (width: number) => Math.log2(((width - 8) * Math.PI) / 512);

describe('MapView globe minimum zoom', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    mapLibre.instances.length = 0;
    resizeCallbacks.length = 0;
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(2000);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fits the globe to a 390 px container with a 4 px gap on each side', async () => {
    containerWidth(390);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resizeCallbacks[0]();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expect.closeTo(globeMinZoomFor(390), 5));
    expect(globeMinZoomFor(390)).toBeCloseTo(1.23, 2);
  });

  it('fits the globe to a 1024 px container', async () => {
    containerWidth(1024);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resizeCallbacks[0]();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expect.closeTo(globeMinZoomFor(1024), 5));
    expect(globeMinZoomFor(1024)).toBeCloseTo(2.64, 2);
  });

  it('updates the minimum zoom when the container is resized', async () => {
    const width = containerWidth(390);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    width.mockReturnValue(1024);
    resizeCallbacks[0]();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expect.closeTo(globeMinZoomFor(1024), 5));
  });

  it('is limited by the height when the container is shorter than it is wide', async () => {
    containerWidth(1024);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(700);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resizeCallbacks[0]();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(expect.closeTo(globeMinZoomFor(700), 5));
    expect(globeMinZoomFor(700)).toBeCloseTo(2.09, 2);
  });

  it('never goes below zoom 0 for a container of 8 px or less', async () => {
    containerWidth(8);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    resizeCallbacks[0]();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(0);
  });

  it('restores minimum zoom -2 when the map is back in Mercator', async () => {
    containerWidth(390);
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    fixture.componentRef.setInput('projection', 'mercator');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapLibre.instances[0].setMinZoom).toHaveBeenLastCalledWith(-2);
  });
});
