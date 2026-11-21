import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockHttpInterceptor } from './mock-http.interceptor';
import { resetMockState } from './mock-state';

describe('mockHttpInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockHttpInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    resetMockState();
  });

  afterEach(() => {
    backend.verify();
  });

  it('answers the login from the mock without a request to the API', () => {
    let accessToken: string | undefined;

    http
      .post<{ accessToken: string }>(
        '/api/auth/login',
        { email: 'mock@matchmap.test', password: 'Mock-pass1' },
        { headers: { 'X-Client': 'web' } },
      )
      .subscribe((body) => (accessToken = body.accessToken));

    expect(accessToken).toBeDefined();
  });

  it('lets other requests reach the API', () => {
    http.get('/api/other').subscribe();

    backend.expectOne('/api/other').flush({});
  });
});
