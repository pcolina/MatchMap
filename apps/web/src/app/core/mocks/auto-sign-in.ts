import { Injector, type Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';

export type AutoSignInStore = {
  accessToken: Signal<string | null>;
  status: Signal<'idle' | 'loading' | 'error'>;
  signIn: (input: { email: string; password: string }) => void;
};

export const autoSignIn = async (
  store: AutoSignInStore,
  credentials: { email: string; password: string },
  enabled: boolean,
  injector: Injector,
): Promise<void> => {
  if (!enabled || store.accessToken() !== null) {
    return;
  }
  store.signIn(credentials);
  if (store.status() !== 'loading') {
    return;
  }
  await firstValueFrom(
    toObservable(store.status, { injector }).pipe(filter((status) => status !== 'loading')),
  );
};
