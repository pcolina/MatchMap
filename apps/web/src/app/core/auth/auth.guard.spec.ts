import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY } from '../../features/auth/state/auth.store';
import { authGuard } from './auth.guard';

const run = () =>
  TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SIGN_IN_GATEWAY, useValue: { signIn: () => of({ accessToken: 'unused' }), refresh: () => of({ accessToken: 'unused' }) } },
      ],
    });
  });

  it('redirects to the sign-in page when there is no session', () => {
    const result = run() as UrlTree;

    expect(result.toString()).toBe('/login');
  });

  it('lets the user through when there is a session', () => {
    TestBed.inject(AuthStore).setAccessToken('token');

    expect(run()).toBe(true);
  });
});
