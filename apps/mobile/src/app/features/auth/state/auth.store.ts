import { computed, inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from 'rxjs';
import { RefreshTokenStorage } from '../../../core/auth/refresh-token-storage.ts';
import type { SignInFailure, SignInGateway } from './auth.model.ts';
import { restoreFlow } from './restore.flow.ts';
import { signInFlow } from './sign-in.flow.ts';

export const SIGN_IN_GATEWAY = new InjectionToken<SignInGateway>('SIGN_IN_GATEWAY');

export interface AuthState {
  status: 'idle' | 'loading' | 'error';
  accessToken: string | null;
  failure: SignInFailure | null;
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
  withMethods((store, gateway = inject(SIGN_IN_GATEWAY), storage = inject(RefreshTokenStorage)) => ({
    signIn: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', failure: null })),
        switchMap(({ email, password }) => signInFlow(gateway, storage, email, password)),
        tap((outcome) =>
          patchState(
            store,
            outcome.kind === 'signedIn'
              ? { status: 'idle', accessToken: outcome.accessToken }
              : { status: 'error', failure: outcome.failure },
          ),
        ),
      ),
    ),
    restore: rxMethod<void>(
      pipe(
        switchMap(() =>
          restoreFlow(gateway, storage).pipe(
            tap((outcome) => patchState(store, { accessToken: outcome.kind === 'restored' ? outcome.accessToken : null })),
            finalize(() => patchState(store, { sessionChecked: true })),
          ),
        ),
      ),
    ),
    setAccessToken: (accessToken: string) => patchState(store, { accessToken }),
    signOut: () => patchState(store, { status: 'idle', accessToken: null, failure: null }),
  })),
);
