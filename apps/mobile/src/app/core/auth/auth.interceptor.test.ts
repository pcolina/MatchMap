import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { View } from '@ng-native/components';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { render } from '@ng-native/testing';
import { beforeEach, expect, test, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { AuthStore } from '../../features/auth/state/auth.store.ts';
import { SIGN_IN_GATEWAY } from '../../features/auth/state/auth.store.ts';
import { RefreshTokenStorage } from './refresh-token-storage.ts';
import { authInterceptor } from './auth.interceptor.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(), deleteItemAsync: vi.fn() }));

@Component({
  selector: 'app-interceptor-host',
  imports: [View],
  template: '<view />',
})
class InterceptorHost {}

const fakeStore = (token: string | null) => {
  const accessToken = signal<string | null>(token);
  return {
    accessToken,
    setAccessToken: vi.fn((value: string) => accessToken.set(value)),
    signOut: vi.fn(() => accessToken.set(null)),
  };
};

const fakeStorage = (stored: string | null) => ({
  read: vi.fn(async () => stored),
  write: vi.fn(async (_refreshToken: string) => undefined),
  clear: vi.fn(async () => undefined),
});

const setup = async (options: { token?: string | null; stored?: string | null; refresh?: () => ReturnType<typeof of> }) => {
  const store = fakeStore(options.token === undefined ? 'expired' : options.token);
  const storage = fakeStorage(options.stored === undefined ? 'stored' : options.stored);
  const gateway = {
    signIn: vi.fn(),
    refresh: vi.fn(options.refresh ?? (() => of({ accessToken: 'fresh', refreshToken: 'rotated' }))),
  };
  const router = { navigateByUrl: vi.fn(async () => true) };
  const { componentRef } = await render(InterceptorHost, {
    providers: [
      { provide: AuthStore, useValue: store },
      { provide: SIGN_IN_GATEWAY, useValue: gateway },
      { provide: RefreshTokenStorage, useValue: storage },
      { provide: Router, useValue: router },
      provideNativeHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
    ],
  });
  return {
    store,
    storage,
    gateway,
    router,
    http: componentRef.injector.get(HttpClient),
    testing: componentRef.injector.get(HttpTestingController),
  };
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  vi.clearAllMocks();
});

test('sends the access token as a bearer token to the API', async () => {
  const { http, testing } = await setup({ token: 'token' });

  http.get('/api/graphql').subscribe();

  const request = testing.expectOne('/api/graphql');
  expect(request.request.headers.get('Authorization')).toBe('Bearer token');
  request.flush({});
  testing.verify();
});

test('does not add the token to the auth endpoints', async () => {
  const { http, testing } = await setup({ token: 'token' });

  http.post('/api/auth/refresh', null).subscribe();

  const request = testing.expectOne('/api/auth/refresh');
  expect(request.request.headers.has('Authorization')).toBe(false);
  request.flush({});
  testing.verify();
});

test('refreshes once with the stored token after a 401 and repeats the request', async () => {
  const { http, testing, store, gateway, storage } = await setup({});
  let body: unknown;

  http.get('/api/graphql').subscribe((response) => (body = response));
  testing.expectOne('/api/graphql').flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
  await settle();

  expect(gateway.refresh).toHaveBeenCalledTimes(1);
  expect(gateway.refresh).toHaveBeenCalledWith('stored');
  expect(storage.write).toHaveBeenCalledWith('rotated');
  expect(store.setAccessToken).toHaveBeenCalledWith('fresh');
  const retry = testing.expectOne('/api/graphql');
  expect(retry.request.headers.get('Authorization')).toBe('Bearer fresh');
  retry.flush({ data: 'ok' });

  expect(body).toEqual({ data: 'ok' });
  testing.verify();
});

test('signs out and goes to the sign-in page when the repeated request fails again', async () => {
  const { http, testing, store, storage, router } = await setup({});

  http.get('/api/graphql').subscribe({ error: () => undefined });
  testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });
  await settle();
  testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });
  await settle();

  expect(store.signOut).toHaveBeenCalledTimes(1);
  expect(storage.clear).toHaveBeenCalledTimes(1);
  expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  testing.verify();
});

test('signs out without any refresh request when no refresh token is stored', async () => {
  const { http, testing, store, gateway, router } = await setup({ stored: null });

  http.get('/api/graphql').subscribe({ error: () => undefined });
  testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });
  await settle();

  expect(gateway.refresh).not.toHaveBeenCalled();
  expect(store.signOut).toHaveBeenCalledTimes(1);
  expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  testing.verify();
});

test('signs out without retrying when the refresh is rejected', async () => {
  const { http, testing, store, router } = await setup({
    refresh: () => throwError(() => 'invalidRefreshToken'),
  });

  http.get('/api/graphql').subscribe({ error: () => undefined });
  testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });
  await settle();

  expect(store.setAccessToken).not.toHaveBeenCalled();
  expect(store.signOut).toHaveBeenCalledTimes(1);
  expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  testing.verify();
});

test('passes other errors through without refreshing', async () => {
  const { http, testing, gateway } = await setup({});
  let failure: unknown;

  http.get('/api/graphql').subscribe({ error: (error) => (failure = error) });
  testing.expectOne('/api/graphql').flush({}, { status: 500, statusText: 'Internal Server Error' });

  expect(gateway.refresh).not.toHaveBeenCalled();
  expect(failure).toBeDefined();
  testing.verify();
});
