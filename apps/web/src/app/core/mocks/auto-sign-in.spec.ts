import { Injector, signal, type Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { autoSignIn, type AutoSignInStore } from './auto-sign-in';

const credentials = { email: 'one@matchmap.test', password: 'One-pass1' };

type Status = 'idle' | 'loading' | 'error';

const fakeStore = (options: { token?: string | null; succeeds?: boolean }) => {
  const accessToken = signal<string | null>(options.token ?? null);
  const status = signal<Status>('idle');
  const calls: { email: string; password: string }[] = [];
  const store: AutoSignInStore & { accessToken: Signal<string | null> } = {
    accessToken: accessToken.asReadonly(),
    status: status.asReadonly(),
    signIn: (input) => {
      calls.push(input);
      status.set('loading');
      queueMicrotask(() => {
        if (options.succeeds === false) {
          status.set('error');
          return;
        }
        accessToken.set('token-from-mock');
        status.set('idle');
      });
    },
  };
  return { store, calls, status };
};

describe('autoSignIn', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = TestBed.inject(Injector);
  });

  it('does nothing when the flag is off', async () => {
    const { store, calls } = fakeStore({});

    await autoSignIn(store, credentials, false, injector);

    expect(calls).toEqual([]);
  });

  it('does not sign in again when a session was restored', async () => {
    const { store, calls } = fakeStore({ token: 'restored-token' });

    await autoSignIn(store, credentials, true, injector);

    expect(calls).toEqual([]);
  });

  it('signs in with the credentials when there is no session', async () => {
    const { store, calls } = fakeStore({});

    await autoSignIn(store, credentials, true, injector);

    expect(calls).toEqual([credentials]);
  });

  it('resolves only after the sign-in has finished', async () => {
    const { store, status } = fakeStore({});

    await autoSignIn(store, credentials, true, injector);

    expect(status()).not.toBe('loading');
  });

  it('resolves without throwing when the sign-in fails', async () => {
    const { store, status } = fakeStore({ succeeds: false });

    await expect(autoSignIn(store, credentials, true, injector)).resolves.toBeUndefined();
    expect(status()).toBe('error');
  });
});
