import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MapView } from './map-view';

type FakeMapInstance = { options: { center?: [number, number] } };

const mapLibre = vi.hoisted(() => {
  const instances: FakeMapInstance[] = [];

  class FakeMap {
    setStyle = vi.fn();
    remove = vi.fn();
    on = vi.fn();
    project = vi.fn(() => ({ x: 0, y: 0 }));

    constructor(public options: { center?: [number, number] }) {
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

describe('MapView centre', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ fallbackLang: 'en' })] });
    mapLibre.instances.length = 0;
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('centres the Mercator map on latitude 42', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.detectChanges();
    await settle(fixture);

    expect(mapLibre.instances[0].options.center).toEqual([0, 42]);
  });

  it('keeps the default centre on the globe', async () => {
    const fixture = TestBed.createComponent(MapView);
    fixture.componentRef.setInput('projection', 'globe');
    fixture.detectChanges();
    await settle(fixture);

    expect(mapLibre.instances[0].options.center).toBeUndefined();
  });
});
