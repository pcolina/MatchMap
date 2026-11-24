import { TestBed } from '@angular/core/testing';
import { MapProjectionStore } from './map-projection.store';

const storageKey = 'matchmap.mapProjection';

const fresh = () => {
  TestBed.resetTestingModule();
  return TestBed.inject(MapProjectionStore);
};

describe('MapProjectionStore', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('opens in the Mercator projection when nothing is saved', () => {
    const store = fresh();

    expect(store.projection()).toBe('mercator');
    expect(store.globe()).toBe(false);
  });

  it('switches to the globe on toggle and keeps the choice on this device', () => {
    const store = fresh();

    store.toggle();

    expect(store.globe()).toBe(true);
    expect(localStorage.getItem(storageKey)).toBe('globe');
  });

  it('reads the saved globe choice back in a new store', () => {
    localStorage.setItem(storageKey, 'globe');

    const store = fresh();

    expect(store.projection()).toBe('globe');
    expect(store.globe()).toBe(true);
  });

  it('switches back to Mercator on a second toggle', () => {
    const store = fresh();

    store.toggle();
    store.toggle();

    expect(store.projection()).toBe('mercator');
    expect(localStorage.getItem(storageKey)).toBe('mercator');
  });

  it('reads an unknown saved value as Mercator', () => {
    localStorage.setItem(storageKey, 'sphere');

    expect(fresh().projection()).toBe('mercator');
  });

  it('keeps the choice for the session when the device storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const store = fresh();

    store.toggle();

    expect(store.globe()).toBe(true);
    expect(fresh().projection()).toBe('mercator');
  });
});
