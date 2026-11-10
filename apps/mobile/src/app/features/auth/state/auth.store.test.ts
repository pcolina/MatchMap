import '@angular/compiler';
import { injectService } from '@ng-native/testing';
import { of, Observable, Subject, throwError } from 'rxjs';
import { expect, test, vi } from 'vitest';
import { RefreshTokenStorage } from '../../../core/auth/refresh-token-storage.ts';
import { SIGN_IN_GATEWAY, AuthStore } from './auth.store.ts';
import type { SignInGateway, Tokens } from './auth.model.ts';

vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(async () => undefined),
  getItemAsync: vi.fn(async () => null),
  deleteItemAsync: vi.fn(async () => undefined),
}));

const credentials = { email: 'user@example.com', password: '123456' };

const setup = (gateway: Partial<SignInGateway>) => {
  const storage = {
    write: vi.fn(async () => undefined),
    read: vi.fn(async () => null),
    clear: vi.fn(async () => undefined),
  };
  const store = injectService(AuthStore, {
    providers: [
      {
        provide: SIGN_IN_GATEWAY,
        useValue: { refresh: () => throwError(() => 'invalidRefreshToken'), ...gateway },
      },
      { provide: RefreshTokenStorage, useValue: storage },
    ],
  });
  return { store, storage };
};

test('starts idle with no token and no failure', () => {
  const { store } = setup({ signIn: () => of({ accessToken: 'token', refreshToken: 'refresh' }) });

  expect(store.status()).toBe('idle');
  expect(store.accessToken()).toBeNull();
  expect(store.failure()).toBeNull();
  expect(store.isLoading()).toBe(false);
});

test('is loading while the sign-in request runs', async () => {
  const response = new Subject<Tokens>();
  const { store } = setup({ signIn: (): Observable<Tokens> => response });

  store.signIn(credentials);

  expect(store.status()).toBe('loading');
  expect(store.isLoading()).toBe(true);

  response.next({ accessToken: 'token', refreshToken: 'refresh' });
  response.complete();

  await vi.waitFor(() => expect(store.status()).toBe('idle'));
  expect(store.isLoading()).toBe(false);
});

test('keeps the access token in memory and stores only the refresh token', async () => {
  const { store, storage } = setup({ signIn: () => of({ accessToken: 'token', refreshToken: 'refresh' }) });

  store.signIn(credentials);

  await vi.waitFor(() => expect(store.accessToken()).toBe('token'));
  expect(storage.write).toHaveBeenCalledWith('refresh');
  expect(storage.write.mock.calls.flat()).not.toContain('token');
});

test('reports invalid credentials and keeps no token', () => {
  const { store, storage } = setup({ signIn: () => throwError(() => 'invalidCredentials') });

  store.signIn(credentials);

  expect(store.status()).toBe('error');
  expect(store.failure()).toBe('invalidCredentials');
  expect(store.accessToken()).toBeNull();
  expect(storage.write).not.toHaveBeenCalled();
});

test('reports a network failure', () => {
  const { store } = setup({ signIn: () => throwError(() => 'network') });

  store.signIn(credentials);

  expect(store.status()).toBe('error');
  expect(store.failure()).toBe('network');
});
