import { TestBed } from '@angular/core/testing';
import { Observable, Subject, throwError, of } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY, type SignInGateway } from './auth.store';

const setup = (gateway: SignInGateway) => {
  TestBed.configureTestingModule({ providers: [{ provide: SIGN_IN_GATEWAY, useValue: gateway }] });
  return TestBed.inject(AuthStore);
};

const credentials = { email: 'user@example.com', password: '123456' };

describe('AuthStore', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts idle with no token and no failure', () => {
    const store = setup({ signIn: () => of({ accessToken: 'token' }) });

    expect(store.status()).toBe('idle');
    expect(store.accessToken()).toBeNull();
    expect(store.failure()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('is loading while the sign-in request runs', () => {
    const response = new Subject<{ accessToken: string }>();
    const store = setup({ signIn: (): Observable<{ accessToken: string }> => response });

    store.signIn(credentials);

    expect(store.status()).toBe('loading');
    expect(store.isLoading()).toBe(true);

    response.next({ accessToken: 'token' });
    response.complete();

    expect(store.status()).toBe('idle');
    expect(store.isLoading()).toBe(false);
  });

  it('keeps the access token in memory and writes nothing to storage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const store = setup({ signIn: () => of({ accessToken: 'token' }) });

    store.signIn(credentials);

    expect(store.accessToken()).toBe('token');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('reports invalid credentials and keeps no token', () => {
    const store = setup({ signIn: () => throwError(() => 'invalidCredentials') });

    store.signIn(credentials);

    expect(store.status()).toBe('error');
    expect(store.failure()).toBe('invalidCredentials');
    expect(store.accessToken()).toBeNull();
  });

  it('reports a network failure', () => {
    const store = setup({ signIn: () => throwError(() => 'network') });

    store.signIn(credentials);

    expect(store.status()).toBe('error');
    expect(store.failure()).toBe('network');
  });

  it('reports too many attempts as its own failure', () => {
    const store = setup({ signIn: () => throwError(() => 'tooManyAttempts') });

    store.signIn(credentials);

    expect(store.failure()).toBe('tooManyAttempts');
  });

  it('clears the previous failure when a new request starts', () => {
    const attempts = [
      () => throwError(() => 'invalidCredentials'),
      () => of({ accessToken: 'token' }),
    ];
    const store = setup({ signIn: () => attempts.shift()!() });

    store.signIn(credentials);
    expect(store.failure()).toBe('invalidCredentials');

    store.signIn(credentials);
    expect(store.failure()).toBeNull();
    expect(store.status()).toBe('idle');
  });
});
