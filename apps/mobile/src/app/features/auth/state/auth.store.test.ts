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
        useValue: { refresh: () => throwError(() => 'invalidRefreshToken'), register: () => of(undefined), ...gateway },
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

test('registers once and then signs in with the same email and password', async () => {
  const register = vi.fn(() => of(undefined));
  const signIn = vi.fn(() => of({ accessToken: 'token', refreshToken: 'refresh' }));
  const { store, storage } = setup({ register, signIn });

  store.register(credentials);

  await vi.waitFor(() => expect(store.accessToken()).toBe('token'));
  expect(register).toHaveBeenCalledTimes(1);
  expect(register).toHaveBeenCalledWith('user@example.com', '123456');
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(signIn).toHaveBeenCalledWith('user@example.com', '123456');
  expect(storage.write).toHaveBeenCalledWith('refresh');
  expect(store.status()).toBe('idle');
  expect(store.failure()).toBeNull();
});

test('is loading while the registration request runs', async () => {
  const response = new Subject<void>();
  const { store } = setup({ register: () => response });

  store.register(credentials);

  expect(store.isLoading()).toBe(true);

  response.next();
  response.complete();

  await vi.waitFor(() => expect(store.status()).not.toBe('loading'));
});

test('reports an email already registered and does not sign in', async () => {
  const signIn = vi.fn(() => of({ accessToken: 'token', refreshToken: 'refresh' }));
  const { store, storage } = setup({ register: () => throwError(() => 'emailTaken'), signIn });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('emailTaken'));
  expect(store.status()).toBe('error');
  expect(signIn).not.toHaveBeenCalled();
  expect(store.accessToken()).toBeNull();
  expect(storage.write).not.toHaveBeenCalled();
});

test('reports an invalid password', async () => {
  const { store } = setup({ register: () => throwError(() => 'passwordInvalid') });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('passwordInvalid'));
});

test('keeps invalid credentials as the sign-in failure after a successful registration', async () => {
  const { store } = setup({ signIn: () => throwError(() => 'invalidCredentials') });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('invalidCredentials'));
  expect(store.status()).toBe('error');
  expect(store.accessToken()).toBeNull();
});

test('keeps too many attempts as the sign-in failure after a successful registration', async () => {
  const { store } = setup({ signIn: () => throwError(() => 'tooManyAttempts') });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('tooManyAttempts'));
});

test('reports a network failure during the sign-in after registration as signInAfterRegister', async () => {
  const { store } = setup({ signIn: () => throwError(() => 'network') });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('signInAfterRegister'));
});

test('reports any other sign-in failure after a successful registration as signInAfterRegister', async () => {
  const { store } = setup({ signIn: () => throwError(() => 'unknown') });

  store.register(credentials);

  await vi.waitFor(() => expect(store.failure()).toBe('signInAfterRegister'));
});
