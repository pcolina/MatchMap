import * as SecureStore from 'expo-secure-store';
import { createState, loadState, saveState, type KeyValueStorage, type MockContext, type MockState } from '@matchmap/shared';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const storageKey = 'matchmap.mock.state';

const randomAlphanumeric = (length: number): string =>
  Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');

const cache = new Map<string, string>();

const cachedStorage: KeyValueStorage = {
  getItem: (key) => cache.get(key) ?? null,
  setItem: (key, value) => {
    cache.set(key, value);
    void Promise.resolve()
      .then(() => SecureStore.setItemAsync(key, value))
      .catch(() => undefined);
  },
};

let state: MockState = createState();

export const initMockState = async (): Promise<void> => {
  try {
    const raw = await SecureStore.getItemAsync(storageKey);
    if (raw !== null) {
      cache.set(storageKey, raw);
    }
    state = loadState(cachedStorage, storageKey);
  } catch {
    state = createState();
  }
};

export const getMockState = (): MockState => state;

export const setMockState = (next: MockState): void => {
  state = next;
  saveState(cachedStorage, storageKey, next);
};

export const resetMockState = (): void => {
  state = createState();
  cache.clear();
};

export const mockContext = (): MockContext => ({ now: Date.now(), random: randomAlphanumeric });
