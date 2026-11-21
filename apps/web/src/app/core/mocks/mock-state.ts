import { createState, loadState, saveState, type KeyValueStorage, type MockContext, type MockState } from '@matchmap/shared';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const storageKey = 'matchmap.mock.state';

const randomAlphanumeric = (length: number): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(length)), (byte) => alphabet[byte % alphabet.length]).join('');

const browserStorage = (): KeyValueStorage | undefined => {
  try {
    return localStorage;
  } catch {
    return undefined;
  }
};

const readInitialState = (): MockState => {
  const storage = browserStorage();
  if (!storage) {
    return createState();
  }
  try {
    return loadState(storage, storageKey);
  } catch {
    return createState();
  }
};

let state: MockState = readInitialState();

export const getMockState = (): MockState => state;

export const setMockState = (next: MockState): void => {
  state = next;
  const storage = browserStorage();
  if (!storage) {
    return;
  }
  try {
    saveState(storage, storageKey, next);
  } catch {
    return;
  }
};

export const resetMockState = (): void => {
  state = createState();
  setMockState(state);
};

export const mockContext = (): MockContext => ({ now: Date.now(), random: randomAlphanumeric });
