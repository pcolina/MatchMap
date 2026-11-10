import * as SecureStore from 'expo-secure-store';
import { beforeEach, expect, test, vi } from 'vitest';
import { RefreshTokenStorage } from './refresh-token-storage.ts';

vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(async () => undefined),
  getItemAsync: vi.fn(async () => null),
  deleteItemAsync: vi.fn(async () => undefined),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('stores the refresh token with expo-secure-store', async () => {
  await new RefreshTokenStorage().write('refresh-1');

  expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'refresh-1');
});

test('reads the refresh token from expo-secure-store', async () => {
  vi.mocked(SecureStore.getItemAsync).mockResolvedValueOnce('refresh-1');

  expect(await new RefreshTokenStorage().read()).toBe('refresh-1');
  expect(SecureStore.getItemAsync).toHaveBeenCalledWith('refreshToken');
});

test('deletes the refresh token on clear', async () => {
  await new RefreshTokenStorage().clear();

  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
});

test('never stores anything but the refresh token', async () => {
  const storage = new RefreshTokenStorage();
  await storage.write('refresh-1');

  const keys = vi.mocked(SecureStore.setItemAsync).mock.calls.map(([key]) => key);
  expect(keys).toEqual(['refreshToken']);
});
