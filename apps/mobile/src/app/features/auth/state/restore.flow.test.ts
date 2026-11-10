import { expect, test, vi } from 'vitest';
import { lastValueFrom, of, throwError } from 'rxjs';
import { restoreFlow } from './restore.flow.ts';
import type { Tokens } from './auth.model.ts';

const tokens: Tokens = { accessToken: 'access', refreshToken: 'rotated' };

const storageHolding = (stored: string | null) => ({
  read: vi.fn(async () => stored),
  write: vi.fn(async (_refreshToken: string) => undefined),
  clear: vi.fn(async () => undefined),
});

test('sends no request and stays anonymous when no refresh token is stored', async () => {
  const storage = storageHolding(null);
  const refresh = vi.fn(() => of(tokens));

  const outcome = await lastValueFrom(restoreFlow({ refresh }, storage));

  expect(outcome).toEqual({ kind: 'anonymous' });
  expect(refresh).not.toHaveBeenCalled();
});

test('refreshes once with the stored token and stores the rotated refresh token', async () => {
  const storage = storageHolding('stored');
  const refresh = vi.fn(() => of(tokens));

  const outcome = await lastValueFrom(restoreFlow({ refresh }, storage));

  expect(refresh).toHaveBeenCalledTimes(1);
  expect(refresh).toHaveBeenCalledWith('stored');
  expect(storage.write).toHaveBeenCalledWith('rotated');
  expect(outcome).toEqual({ kind: 'restored', accessToken: 'access' });
});

test('clears the stored token and stays anonymous when the refresh is rejected', async () => {
  const storage = storageHolding('stored');
  const refresh = () => throwError(() => 'invalidRefreshToken');

  const outcome = await lastValueFrom(restoreFlow({ refresh }, storage));

  expect(storage.clear).toHaveBeenCalledTimes(1);
  expect(storage.write).not.toHaveBeenCalled();
  expect(outcome).toEqual({ kind: 'anonymous' });
});
