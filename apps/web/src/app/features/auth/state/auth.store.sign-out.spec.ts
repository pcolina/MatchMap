import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY, type SignInGateway } from './auth.store';

const setup = (logout: SignInGateway['logout']) => {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: SIGN_IN_GATEWAY,
        useValue: { signIn: () => of({ accessToken: 'token' }), refresh: () => throwError(() => 'invalidRefreshToken'), logout },
      },
    ],
  });
  const store = TestBed.inject(AuthStore);
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  store.setAccessToken('token');
  return { store, navigate };
};

describe('AuthStore sign out', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clears the access token and goes to sign-in after a successful logout', () => {
    const { store, navigate } = setup(() => of(undefined));

    store.signOutRemote();

    expect(store.accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('clears the access token and goes to sign-in even when the logout call fails', () => {
    const { store, navigate } = setup(() => throwError(() => new Error('network')));

    store.signOutRemote();

    expect(store.accessToken()).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
