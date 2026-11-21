import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { loadState, saveState, type KeyValueStorage } from '../src/mocks/storage';
import { register } from '../src/mocks/register';
import { signIn } from '../src/mocks/sign-in';
import usersData from '../src/mocks/data/users.json';
import type { MockContext } from '../src/mocks/types';

const key = 'matchmap.mock.state';
const memoryStorage = (): KeyValueStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (name) => values.get(name) ?? null,
    setItem: (name, value) => {
      values.set(name, value);
    },
  };
};
const context: MockContext = { now: Date.UTC(2026, 0, 2), random: (length) => 'z'.repeat(length) };

describe('stored mock state', () => {
  it('keeps a registered user after the state is read again', () => {
    const storage = memoryStorage();
    const registered = register(createState(), { email: 'kept@matchmap.test', password: 'Kept-pass1' }, context).state;
    saveState(storage, key, registered);

    const reloaded = loadState(storage, key);
    const result = signIn(reloaded, { client: 'web', email: 'kept@matchmap.test', password: 'Kept-pass1' }, context);

    expect(result.status).toBe(200);
  });

  it('gives only the users of the users data file when nothing is stored', () => {
    const state = loadState(memoryStorage(), key);

    expect(state.users.map((user) => user.email)).toEqual(usersData.map((user) => user.email));
  });

  it('does not store any access token', () => {
    const storage = memoryStorage();
    const result = signIn(createState(), { client: 'web', email: 'mock@matchmap.test', password: 'Mock-pass1' }, context);
    saveState(storage, key, result.state);

    expect(storage.getItem(key)).not.toContain('accessToken');
    expect(storage.getItem(key)).not.toContain('mock.');
  });
});
