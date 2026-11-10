import '@angular/compiler';
import { Component } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { View } from '@ng-native/components';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { render } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { AuthApi } from './auth.api.ts';

@Component({
  selector: 'app-api-host',
  imports: [View],
  template: '<view />',
})
class ApiHost {}

const setup = async () => {
  const { componentRef } = await render(ApiHost, {
    providers: [provideNativeHttpClient(), provideHttpClientTesting()],
  });
  return {
    api: componentRef.injector.get(AuthApi),
    http: componentRef.injector.get(HttpTestingController),
  };
};

const tokenBody = { tokenType: 'Bearer', accessToken: 'access', expiresIn: 900, refreshToken: 'refresh' };

test('sends one sign-in request with the normalised email and the mobile client header', async () => {
  const { api, http } = await setup();
  let tokens: unknown;
  api.signIn(' User@Example.com ', '123456').subscribe((result) => (tokens = result));

  const request = http.expectOne('/api/auth/login');
  expect(request.request.method).toBe('POST');
  expect(request.request.body).toEqual({ email: 'user@example.com', password: '123456' });
  expect(request.request.headers.get('X-Client')).toBe('mobile');

  request.flush(tokenBody);

  expect(tokens).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
  http.verify();
});

test('maps invalid credentials to its failure', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.signIn('user@example.com', 'wrong').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/login').flush({ error: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });

  expect(failure).toBe('invalidCredentials');
  http.verify();
});

test('maps too many attempts to its failure', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.signIn('user@example.com', 'wrong').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/login').flush({ error: 'too_many_attempts' }, { status: 429, statusText: 'Too Many Requests' });

  expect(failure).toBe('tooManyAttempts');
  http.verify();
});

test('maps a request with no connection to the network failure', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.signIn('user@example.com', '123456').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/login').flush({}, { status: 0, statusText: 'Unknown Error' });

  expect(failure).toBe('network');
  http.verify();
});

test('treats a response without a refresh token as unknown', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.signIn('user@example.com', '123456').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/login').flush({ tokenType: 'Bearer', accessToken: 'access', expiresIn: 900 });

  expect(failure).toBe('unknown');
  http.verify();
});

test('maps any other error to the unknown failure', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.signIn('user@example.com', '123456').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/login').flush({ error: 'server_error' }, { status: 500, statusText: 'Internal Server Error' });

  expect(failure).toBe('unknown');
  http.verify();
});

test('sends the stored refresh token in the body with the mobile client header', async () => {
  const { api, http } = await setup();
  let tokens: unknown;
  api.refresh('stored').subscribe((result) => (tokens = result));

  const request = http.expectOne('/api/auth/refresh');
  expect(request.request.method).toBe('POST');
  expect(request.request.body).toEqual({ refreshToken: 'stored' });
  expect(request.request.headers.get('X-Client')).toBe('mobile');

  request.flush(tokenBody);

  expect(tokens).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
  http.verify();
});

test('maps a rejected refresh to the invalid refresh token failure', async () => {
  const { api, http } = await setup();
  let failure: unknown;
  api.refresh('stored').subscribe({ error: (error) => (failure = error) });

  http.expectOne('/api/auth/refresh').flush({ error: 'invalid_refresh_token' }, { status: 401, statusText: 'Unauthorized' });

  expect(failure).toBe('invalidRefreshToken');
  http.verify();
});
