import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY } from '../../features/auth/state/auth.store';
import { authInterceptor } from './auth.interceptor';

const setup = (refresh: () => Observable<{ accessToken: string }>) => {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: SIGN_IN_GATEWAY, useValue: { signIn: () => of({ accessToken: 'unused' }), refresh } },
    ],
  });
  const store = TestBed.inject(AuthStore);
  const router = TestBed.inject(Router);
  const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  return {
    http: TestBed.inject(HttpClient),
    testing: TestBed.inject(HttpTestingController),
    store,
    navigate,
  };
};

describe('authInterceptor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the access token as a bearer token to the API', () => {
    const { http, testing, store } = setup(() => throwError(() => 'unused'));
    store.setAccessToken('token');

    http.get('/api/graphql').subscribe();

    const request = testing.expectOne('/api/graphql');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token');
    request.flush({});
    testing.verify();
  });

  it('does not add the token to the auth endpoints', () => {
    const { http, testing, store } = setup(() => throwError(() => 'unused'));
    store.setAccessToken('token');

    http.post('/api/auth/refresh', null).subscribe();

    const request = testing.expectOne('/api/auth/refresh');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
    testing.verify();
  });

  it('refreshes once after a 401 and repeats the request with the new token', () => {
    const refresh = vi.fn(() => of({ accessToken: 'fresh' }));
    const { http, testing, store } = setup(refresh);
    store.setAccessToken('expired');
    let body: unknown;

    http.get('/api/graphql').subscribe((response) => (body = response));
    testing
      .expectOne('/api/graphql')
      .flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(store.accessToken()).toBe('fresh');
    const retry = testing.expectOne('/api/graphql');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer fresh');
    retry.flush({ data: 'ok' });

    expect(body).toEqual({ data: 'ok' });
    testing.verify();
  });

  it('signs the user out when the repeated request is rejected again', () => {
    const { http, testing, store, navigate } = setup(() => of({ accessToken: 'fresh' }));
    store.setAccessToken('expired');
    let failure: unknown;

    http.get('/api/graphql').subscribe({ error: (error) => (failure = error) });
    testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });
    testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(failure).toBeDefined();
    expect(store.accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
    testing.verify();
  });

  it('signs the user out without retrying when the refresh is rejected', () => {
    const { http, testing, store, navigate } = setup(() => throwError(() => 'invalidRefreshToken'));
    store.setAccessToken('expired');

    http.get('/api/graphql').subscribe({ error: () => undefined });
    testing.expectOne('/api/graphql').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(store.accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
    testing.verify();
  });

  it('passes other errors through without refreshing', () => {
    const refresh = vi.fn(() => of({ accessToken: 'fresh' }));
    const { http, testing, store } = setup(refresh);
    store.setAccessToken('token');
    let failure: unknown;

    http.get('/api/graphql').subscribe({ error: (error) => (failure = error) });
    testing.expectOne('/api/graphql').flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(refresh).not.toHaveBeenCalled();
    expect(failure).toBeDefined();
    testing.verify();
  });
});
