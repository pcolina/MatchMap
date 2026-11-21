import { createState } from './state.ts';
import type { MockState } from './types.ts';

export type KeyValueStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export const loadState = (storage: KeyValueStorage, key: string): MockState => {
  const raw = storage.getItem(key);
  if (raw === null) {
    return createState();
  }
  return JSON.parse(raw) as MockState;
};

export const saveState = (storage: KeyValueStorage, key: string, state: MockState): void => {
  storage.setItem(key, JSON.stringify(state));
};
