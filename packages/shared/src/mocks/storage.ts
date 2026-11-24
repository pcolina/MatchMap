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
  const stored = JSON.parse(raw) as MockState;
  const seeds = createState().users;
  return {
    ...stored,
    users: stored.users.map((user) => {
      const seed = seeds.find((candidate) => candidate.id === user.id);
      return seed?.unreadNotifications === undefined ? user : { ...user, unreadNotifications: seed.unreadNotifications };
    }),
  };
};

export const saveState = (storage: KeyValueStorage, key: string, state: MockState): void => {
  storage.setItem(key, JSON.stringify(state));
};
