import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApi } from './auth.api';

const tokenBody = { tokenType: 'Bearer', accessToken: 'token', expiresIn: 900, refreshToken: 'ignored' };

describe('AuthApi', () => {
  let api: AuthApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(AuthApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('sends one sign-in request with the normalised email and credentials included', () => {
    let accessToken: string | undefined;
    api.signIn(' User@Example.com ', '123456').subscribe((result) => (accessToken = result.accessToken));

    const request = http.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'user@example.com', password: '123456' });
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.headers.get('X-Client')).toBe('web');

    request.flush(tokenBody);

    expect(accessToken).toBe('token');
  });

  it('sends one refresh request with credentials, the web client header and no body', () => {
    let accessToken: string | undefined;
    api.refresh().subscribe((result) => (accessToken = result.accessToken));

    const request = http.expectOne('/api/auth/refresh');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeNull();
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.headers.get('X-Client')).toBe('web');

    request.flush(tokenBody);

    expect(accessToken).toBe('token');
  });

  it('maps a rejected refresh to the invalid refresh token failure', () => {
    let failure: unknown;
    api.refresh().subscribe({ error: (error) => (failure = error) });

    http
      .expectOne('/api/auth/refresh')
      .flush({ error: 'invalid_refresh_token' }, { status: 401, statusText: 'Unauthorized' });

    expect(failure).toBe('invalidRefreshToken');
  });

  it('maps invalid credentials to its failure', () => {
    let failure: unknown;
    api.signIn('user@example.com', 'wrong').subscribe({ error: (error) => (failure = error) });

    http
      .expectOne('/api/auth/login')
      .flush({ error: 'invalid_credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(failure).toBe('invalidCredentials');
  });

  it('maps too many attempts to its failure', () => {
    let failure: unknown;
    api.signIn('user@example.com', 'wrong').subscribe({ error: (error) => (failure = error) });

    http
      .expectOne('/api/auth/login')
      .flush({ error: 'too_many_attempts' }, { status: 429, statusText: 'Too Many Requests' });

    expect(failure).toBe('tooManyAttempts');
  });

  it('maps a request with no connection to the network failure', () => {
    let failure: unknown;
    api.signIn('user@example.com', '123456').subscribe({ error: (error) => (failure = error) });

    http.expectOne('/api/auth/login').error(new ProgressEvent('error'));

    expect(failure).toBe('network');
  });

  it('maps any other error to the unknown failure', () => {
    let failure: unknown;
    api.signIn('user@example.com', '123456').subscribe({ error: (error) => (failure = error) });

    http
      .expectOne('/api/auth/login')
      .flush({ error: 'server_error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(failure).toBe('unknown');
  });
});
