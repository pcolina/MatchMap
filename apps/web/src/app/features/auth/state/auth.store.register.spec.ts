import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY, type SignInGateway } from './auth.store';

const setup = (gateway: Partial<SignInGateway>) => {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: SIGN_IN_GATEWAY,
        useValue: {
          signIn: () => throwError(() => 'invalidCredentials'),
          refresh: () => throwError(() => 'invalidRefreshToken'),
          register: () => of(undefined),
          ...gateway,
        },
      },
    ],
  });
  return TestBed.inject(AuthStore);
};

const credentials = { email: 'user@example.com', password: 'Abc!12' };

describe('AuthStore register', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers once and then signs in with the same email and password', () => {
    const register = vi.fn(() => of(undefined));
    const signIn = vi.fn(() => of({ accessToken: 'token' }));
    const store = setup({ register, signIn });

    store.register(credentials);

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith('user@example.com', 'Abc!12');
    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith('user@example.com', 'Abc!12');
    expect(store.accessToken()).toBe('token');
    expect(store.status()).toBe('idle');
    expect(store.failure()).toBeNull();
  });

  it('reports an email already registered and does not sign in', () => {
    const signIn = vi.fn(() => of({ accessToken: 'token' }));
    const store = setup({ register: () => throwError(() => 'emailTaken'), signIn });

    store.register(credentials);

    expect(store.status()).toBe('error');
    expect(store.failure()).toBe('emailTaken');
    expect(signIn).not.toHaveBeenCalled();
    expect(store.accessToken()).toBeNull();
  });

  it('reports an invalid password', () => {
    const store = setup({ register: () => throwError(() => 'passwordInvalid') });

    store.register(credentials);

    expect(store.failure()).toBe('passwordInvalid');
  });

  it('reports a failed sign-in after a successful registration', () => {
    const store = setup({ signIn: () => throwError(() => 'invalidCredentials') });

    store.register(credentials);

    expect(store.status()).toBe('error');
    expect(store.failure()).toBe('signInAfterRegister');
    expect(store.accessToken()).toBeNull();
  });

  it('reports a network failure during the sign-in after registration with the same failure', () => {
    const store = setup({ signIn: () => throwError(() => 'network') });

    store.register(credentials);

    expect(store.failure()).toBe('signInAfterRegister');
  });
});
