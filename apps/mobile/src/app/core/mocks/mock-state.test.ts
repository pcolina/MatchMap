import { beforeEach, expect, test, vi } from 'vitest';
import { register, signIn, createState } from '@matchmap/shared';
import usersData from '../../../../../../packages/shared/src/mocks/data/users.json';

const secureStore = vi.hoisted(() => {
  const values = new Map<string, string>();
  return {
    values,
    setItemAsync: vi.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
    getItemAsync: vi.fn(async (key: string) => values.get(key) ?? null),
    deleteItemAsync: vi.fn(async (key: string) => {
      values.delete(key);
    }),
  };
});

vi.mock('expo-secure-store', () => secureStore);

const context = { now: Date.UTC(2026, 0, 2), random: (length: number) => 'z'.repeat(length) };

const reloadMockState = async () => {
  vi.resetModules();
  const module = await import('./mock-state.ts');
  await module.initMockState();
  return module;
};

beforeEach(() => {
  secureStore.values.clear();
  vi.clearAllMocks();
});

test('keeps a registered user after the app restarts', async () => {
  const first = await reloadMockState();
  first.setMockState(register(first.getMockState(), { email: 'kept@matchmap.test', password: 'Kept-pass1' }, context).state);

  const second = await reloadMockState();
  const result = signIn(second.getMockState(), { client: 'mobile', email: 'kept@matchmap.test', password: 'Kept-pass1' }, context);

  expect(result.status).toBe(200);
});

test('starts with the users of the users data file when nothing is stored', async () => {
  const module = await reloadMockState();

  expect(module.getMockState().users.map((user) => user.email)).toEqual(usersData.map((user) => user.email));
});

test('does not store any access token', async () => {
  const module = await reloadMockState();
  module.setMockState(signIn(module.getMockState(), { client: 'mobile', email: 'one@matchmap.test', password: 'One-pass1' }, context).state);

  const stored = secureStore.values.get('matchmap.mock.state') ?? '';
  expect(stored).not.toContain('accessToken');
  expect(stored).not.toContain('mock.');
  expect(createState()).toBeDefined();
});
