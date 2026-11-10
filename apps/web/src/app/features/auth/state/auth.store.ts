import { computed, inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, Observable, pipe, switchMap, tap } from 'rxjs';

export type SignInFailure = 'invalidCredentials' | 'invalidRefreshToken' | 'tooManyAttempts' | 'network' | 'unknown';

export type RegisterFailure = 'emailTaken' | 'passwordInvalid' | 'network' | 'unknown';

export type AuthFailure = SignInFailure | RegisterFailure | 'signInAfterRegister';

export interface SignInGateway {
  signIn(email: string, password: string): Observable<{ accessToken: string }>;
  refresh(): Observable<{ accessToken: string }>;
  register(email: string, password: string): Observable<void>;
}

export const SIGN_IN_GATEWAY = new InjectionToken<SignInGateway>('SIGN_IN_GATEWAY');

export interface AuthState {
  status: 'idle' | 'loading' | 'error';
  accessToken: string | null;
  failure: AuthFailure | null;
  sessionChecked: boolean;
}

const initialState: AuthState = {
  status: 'idle',
  accessToken: null,
  failure: null,
  sessionChecked: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withComputed(({ status }) => ({
    isLoading: computed(() => status() === 'loading'),
  })),
  withMethods((store, gateway = inject(SIGN_IN_GATEWAY)) => ({
    signIn: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', failure: null })),
        switchMap(({ email, password }) =>
          gateway.signIn(email, password).pipe(
            tap(({ accessToken }) => patchState(store, { status: 'idle', accessToken })),
            catchError((failure: SignInFailure) => {
              patchState(store, { status: 'error', failure });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
    register: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', failure: null })),
        switchMap(({ email, password }) =>
          gateway.register(email, password).pipe(
            switchMap(() =>
              gateway.signIn(email, password).pipe(
                tap(({ accessToken }) => patchState(store, { status: 'idle', accessToken })),
                catchError((failure: SignInFailure) => {
                  const kept = failure === 'invalidCredentials' || failure === 'tooManyAttempts';
                  patchState(store, { status: 'error', failure: kept ? failure : 'signInAfterRegister' });
                  return EMPTY;
                }),
              ),
            ),
            catchError((failure: RegisterFailure) => {
              patchState(store, { status: 'error', failure });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
    restore: rxMethod<void>(
      pipe(
        switchMap(() =>
          gateway.refresh().pipe(
            tap(({ accessToken }) => patchState(store, { accessToken })),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { sessionChecked: true })),
          ),
        ),
      ),
    ),
    setAccessToken: (accessToken: string) => patchState(store, { accessToken }),
    signOut: () => patchState(store, { status: 'idle', accessToken: null, failure: null }),
  })),
);
