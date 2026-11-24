import { TestBed } from '@angular/core/testing';
import { NotificationsStore } from './notifications.store';

const storageKey = 'matchmap.notifications.pending';

const fresh = () => {
  TestBed.resetTestingModule();
  return TestBed.inject(NotificationsStore);
};

describe('NotificationsStore', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('has no pending notification when nothing is saved', () => {
    const store = fresh();

    expect(store.count()).toBe(0);
    expect(store.pending()).toBe(false);
  });

  it('reads the stored whole number as the pending count', () => {
    localStorage.setItem(storageKey, '3');
    const store = fresh();

    expect(store.count()).toBe(3);
    expect(store.pending()).toBe(true);
  });

  it('reads a stored zero as no pending notification', () => {
    localStorage.setItem(storageKey, '0');
    const store = fresh();

    expect(store.count()).toBe(0);
    expect(store.pending()).toBe(false);
  });

  it('reads a value that is not a whole number as 0', () => {
    localStorage.setItem(storageKey, 'many');
    expect(fresh().count()).toBe(0);

    localStorage.setItem(storageKey, '2.5');
    expect(fresh().count()).toBe(0);
  });

  it('reads a negative stored value as 0', () => {
    localStorage.setItem(storageKey, '-4');
    const store = fresh();

    expect(store.count()).toBe(0);
    expect(store.pending()).toBe(false);
  });

  it('reads 0 when the device storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    const store = fresh();

    expect(store.count()).toBe(0);
    expect(store.pending()).toBe(false);
  });
});
