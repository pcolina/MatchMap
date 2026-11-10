import { expect, test, vi } from 'vitest';
import { lastValueFrom, of, throwError } from 'rxjs';
import { signInFlow } from './sign-in.flow.ts';
import type { RefreshTokenWriter, SignInGateway } from './auth.model.ts';

const tokens = { accessToken: 'access', refreshToken: 'refresh' };

const writerThatSucceeds = (): RefreshTokenWriter & { write: ReturnType<typeof vi.fn> } => ({
  write: vi.fn(async () => undefined),
});

const gatewayReturning = (signIn: SignInGateway['signIn']): SignInGateway => ({
  signIn,
  refresh: () => throwError(() => 'unused'),
});

test('signs the user in with the access token and stores only the refresh token', async () => {
  const storage = writerThatSucceeds();

  const outcome = await lastValueFrom(
    signInFlow(gatewayReturning(() => of(tokens)), storage, 'user@example.com', '123456'),
  );

  expect(outcome).toEqual({ kind: 'signedIn', accessToken: 'access' });
  expect(storage.write).toHaveBeenCalledTimes(1);
  expect(storage.write).toHaveBeenCalledWith('refresh');
  expect(storage.write.mock.calls.flat()).not.toContain('access');
});

test.each(['invalidCredentials', 'tooManyAttempts', 'network'] as const)(
  'reports the %s failure and stores nothing',
  async (failure) => {
    const storage = writerThatSucceeds();

    const outcome = await lastValueFrom(
      signInFlow(gatewayReturning(() => throwError(() => failure)), storage, 'user@example.com', '123456'),
    );

    expect(outcome).toEqual({ kind: 'failed', failure });
    expect(storage.write).not.toHaveBeenCalled();
  },
);

test('reports any other error as unknown', async () => {
  const outcome = await lastValueFrom(
    signInFlow(gatewayReturning(() => throwError(() => new Error('boom'))), writerThatSucceeds(), 'a@b.c', '123456'),
  );

  expect(outcome).toEqual({ kind: 'failed', failure: 'unknown' });
});

test('reports a storage failure as unknown and keeps no token', async () => {
  const storage: RefreshTokenWriter = { write: async () => Promise.reject(new Error('keychain')) };

  const outcome = await lastValueFrom(
    signInFlow(gatewayReturning(() => of(tokens)), storage, 'user@example.com', '123456'),
  );

  expect(outcome).toEqual({ kind: 'failed', failure: 'unknown' });
});

test('sends the email and password it was given to the gateway', async () => {
  const signIn = vi.fn(() => of(tokens));

  await lastValueFrom(signInFlow(gatewayReturning(signIn), writerThatSucceeds(), 'user@example.com', '123456'));

  expect(signIn).toHaveBeenCalledWith('user@example.com', '123456');
});
