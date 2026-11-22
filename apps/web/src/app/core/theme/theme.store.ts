import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

export type ThemeChoice = 'system' | 'light' | 'dark';

const storageKey = 'matchmap.theme';

const readChoice = (): ThemeChoice => {
  try {
    const value = localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
};

const writeChoice = (choice: ThemeChoice): void => {
  try {
    if (choice === 'system') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, choice);
    }
  } catch {
    return;
  }
};

const applyChoice = (choice: ThemeChoice): void => {
  const root = document.documentElement;
  if (choice === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', choice);
  }
};

const systemQuery = (): MediaQueryList => globalThis.matchMedia('(prefers-color-scheme: dark)');

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({ choice: readChoice(), systemDark: systemQuery().matches })),
  withComputed(({ choice, systemDark }) => ({
    isDark: computed(() => choice() === 'dark' || (choice() === 'system' && systemDark())),
  })),
  withMethods((store) => ({
    toggle: (): void => {
      const next: ThemeChoice = store.isDark() ? 'light' : 'dark';
      writeChoice(next);
      applyChoice(next);
      patchState(store, { choice: next });
    },
  })),
  withHooks({
    onInit(store) {
      applyChoice(store.choice());
      systemQuery().addEventListener('change', (event) => patchState(store, { systemDark: event.matches }));
    },
  }),
);
