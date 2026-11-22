import { inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, NEVER, Observable, pipe, switchMap, tap } from 'rxjs';

export interface AccountUser {
  username: string;
  email: string;
}

export interface AccountGateway {
  me(): Observable<AccountUser>;
}

export const ACCOUNT_GATEWAY = new InjectionToken<AccountGateway>('ACCOUNT_GATEWAY', {
  providedIn: 'root',
  factory: () => ({ me: () => NEVER }),
});

export interface AccountState {
  username: string | null;
  email: string | null;
}

export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState<AccountState>({ username: null, email: null }),
  withMethods((store, gateway = inject(ACCOUNT_GATEWAY)) => ({
    load: rxMethod<void>(
      pipe(
        switchMap(() =>
          gateway.me().pipe(
            tap((user) => patchState(store, { username: user.username, email: user.email })),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),
  })),
);
