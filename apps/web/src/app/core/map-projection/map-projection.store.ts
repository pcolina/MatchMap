import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type MapProjection = 'mercator' | 'globe';

const storageKey = 'matchmap.mapProjection';

const readProjection = (): MapProjection => {
  try {
    return localStorage.getItem(storageKey) === 'globe' ? 'globe' : 'mercator';
  } catch {
    return 'mercator';
  }
};

const writeProjection = (projection: MapProjection): void => {
  try {
    localStorage.setItem(storageKey, projection);
  } catch {
    return;
  }
};

export const MapProjectionStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ projection: readProjection() as MapProjection })),
  withComputed(({ projection }) => ({
    globe: computed(() => projection() === 'globe'),
  })),
  withMethods((store) => ({
    toggle: (): void => {
      const next: MapProjection = store.globe() ? 'mercator' : 'globe';
      writeProjection(next);
      patchState(store, { projection: next });
    },
  })),
);
