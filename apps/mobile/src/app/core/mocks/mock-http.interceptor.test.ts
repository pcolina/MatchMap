import '@angular/compiler';
import { Component } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { View } from '@ng-native/components';
import { render } from '@ng-native/testing';
import { beforeEach, expect, test, vi } from 'vitest';
import { mockHttpInterceptor } from './mock-http.interceptor.ts';
import { resetMockState } from './mock-state.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(async () => null), deleteItemAsync: vi.fn() }));

@Component({
  selector: 'app-mock-host',
  imports: [View],
  template: '<view />',
})
class MockHost {}

const setup = async () => {
  const { componentRef } = await render(MockHost, {
    providers: [provideHttpClient(withInterceptors([mockHttpInterceptor])), provideHttpClientTesting()],
  });
  return {
    http: componentRef.injector.get(HttpClient),
    testing: componentRef.injector.get(HttpTestingController),
  };
};

beforeEach(() => {
  resetMockState();
});

test('answers the mobile login with a refresh token in the body, without a request to the API', async () => {
  const { http, testing } = await setup();
  let body: Record<string, unknown> | undefined;

  http
    .post<Record<string, unknown>>('/api/auth/login', { email: 'one@matchmap.test', password: 'One-pass1' }, { headers: { 'X-Client': 'mobile' } })
    .subscribe((response) => (body = response));

  expect(body).toMatchObject({ tokenType: 'Bearer', refreshToken: expect.any(String) });
  testing.verify();
});

test('refreshes the mobile session with the refresh token sent in the body', async () => {
  const { http } = await setup();
  let refreshToken: string | undefined;
  http
    .post<Record<string, unknown>>('/api/auth/login', { email: 'one@matchmap.test', password: 'One-pass1' }, { headers: { 'X-Client': 'mobile' } })
    .subscribe((response) => (refreshToken = response['refreshToken'] as string));
  let rotated: Record<string, unknown> | undefined;

  http
    .post<Record<string, unknown>>('/api/auth/refresh', { refreshToken }, { headers: { 'X-Client': 'mobile' } })
    .subscribe((response) => (rotated = response));

  expect(rotated).toMatchObject({ tokenType: 'Bearer', refreshToken: expect.any(String) });
  expect(rotated?.['refreshToken']).not.toBe(refreshToken);
});

test('lets requests that are not auth operations reach the API', async () => {
  const { http, testing } = await setup();

  http.get('/api/other').subscribe();

  testing.expectOne('/api/other').flush({});
  testing.verify();
});
