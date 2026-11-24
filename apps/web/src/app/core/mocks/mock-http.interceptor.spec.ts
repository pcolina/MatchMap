import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockHttpInterceptor, resetWebRefreshCookie } from './mock-http.interceptor';
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
    resetWebRefreshCookie();
  });

  afterEach(() => {
    backend.verify();
  });

  it('answers the login from the mock without a request to the API', () => {
    let accessToken: string | undefined;

    http
      .post<{ accessToken: string }>(
        '/api/auth/login',
        { email: 'one@matchmap.test', password: 'One-pass1' },
        { headers: { 'X-Client': 'web' } },
      )
      .subscribe((body) => (accessToken = body.accessToken));

    expect(accessToken).toBeDefined();
  });

  it('keeps the web refresh token in the cookie emulation and rotates it on refresh', () => {
    http.post('/api/auth/login', { email: 'one@matchmap.test', password: 'One-pass1' }, { headers: { 'X-Client': 'web' } }).subscribe();

    let firstBody: Record<string, unknown> | undefined;
    http.post<Record<string, unknown>>('/api/auth/refresh', null, { headers: { 'X-Client': 'web' } }).subscribe((body) => (firstBody = body));
    let secondStatus: number | undefined;
    http.post('/api/auth/refresh', null, { headers: { 'X-Client': 'web' } }).subscribe({
      next: () => (secondStatus = 200),
      error: (error: { status: number }) => (secondStatus = error.status),
    });

    expect(firstBody).toMatchObject({ tokenType: 'Bearer' });
    expect(firstBody).not.toHaveProperty('refreshToken');
    expect(secondStatus).toBe(200);
  });

  it('lets other requests reach the API', () => {
    http.get('/api/other').subscribe();

    backend.expectOne('/api/other').flush({});
  });

  it('sets the device pending count from the unread notifications of the user who signs in', () => {
    localStorage.setItem('matchmap.notifications.pending', '5');
    try {
      http.post('/api/auth/login', { email: 'one@matchmap.test', password: 'One-pass1' }, { headers: { 'X-Client': 'web' } }).subscribe();
      backend.verify();

      expect(localStorage.getItem('matchmap.notifications.pending')).toBe('1');
    } finally {
      localStorage.removeItem('matchmap.notifications.pending');
    }
  });

  it('sets the device pending count to 0 for a user with no unread notification', () => {
    localStorage.setItem('matchmap.notifications.pending', '5');
    try {
      http.post('/api/auth/login', { email: 'two@matchmap.test', password: 'Two-pass2' }, { headers: { 'X-Client': 'web' } }).subscribe();

      expect(localStorage.getItem('matchmap.notifications.pending')).toBe('0');
    } finally {
      localStorage.removeItem('matchmap.notifications.pending');
    }
  });

  it('keeps the device pending count when the sign-in fails', () => {
    localStorage.setItem('matchmap.notifications.pending', '5');
    try {
      http.post('/api/auth/login', { email: 'one@matchmap.test', password: 'wrong-pass' }, { headers: { 'X-Client': 'web' } }).subscribe({ error: () => undefined });

      expect(localStorage.getItem('matchmap.notifications.pending')).toBe('5');
    } finally {
      localStorage.removeItem('matchmap.notifications.pending');
    }
  });
});
