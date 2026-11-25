import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MapView } from './map-view';

type Listener = () => void;
type FakeMapInstance = {
  options: { renderWorldCopies?: boolean };
  on: ReturnType<typeof vi.fn>;
  getBounds: ReturnType<typeof vi.fn>;
  getCenter: ReturnType<typeof vi.fn>;
  easeTo: ReturnType<typeof vi.fn>;
};

let visibleSouth = -70;

const mapLibre = vi.hoisted(() => {
  const instances: FakeMapInstance[] = [];

  class FakeMap {
    setStyle = vi.fn();
    remove = vi.fn();
    on = vi.fn();
    project = vi.fn(() => ({ x: 0, y: 0 }));
    getBounds = vi.fn(() => ({ getSouth: () => visibleSouth }));
    getCenter = vi.fn(() => ({ lng: 0, lat: 42 }));
    easeTo = vi.fn();

    constructor(public options: { renderWorldCopies?: boolean }) {
      instances.push(this as unknown as FakeMapInstance);
    }
  }

  return { instances, FakeMap };
});

vi.mock('maplibre-gl', () => ({
  Map: mapLibre.FakeMap,
}));

const settle = async (fixture: { whenStable: () => Promise<unknown> }) => {
  await fixture.whenStable();
  await vi.waitFor(() => expect(mapLibre.instances.length).toBeGreaterThan(0));
};

const moveEndListener = (map: FakeMapInstance): Listener => {
  const call = map.on.mock.calls.find(([event]) => event === 'moveend');
  return call?.[1] as Listener;
};

describe('MapView keeps the view above latitude -60', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    mapLibre.instances.length = 0;
    visibleSouth = -70;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('eases the map north when the visible bottom goes below latitude -60 in Mercator', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await settle(fixture);

    moveEndListener(mapLibre.instances[0])();

    expect(mapLibre.instances[0].easeTo).toHaveBeenCalledWith(expect.objectContaining({ center: [0, 52] }));
  });

  it('does not repeat the world horizontally in Mercator', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await settle(fixture);

    expect(mapLibre.instances[0].options.renderWorldCopies).toBe(false);
  });

  it('does nothing while the visible bottom stays above latitude -60', async () => {
    visibleSouth = -40;
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await settle(fixture);

    moveEndListener(mapLibre.instances[0])();

    expect(mapLibre.instances[0].easeTo).not.toHaveBeenCalled();
  });
});
