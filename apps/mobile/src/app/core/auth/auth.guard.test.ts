import '@angular/compiler';
import { Component, runInInjectionContext, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { View } from '@ng-native/components';
import { render } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { AuthStore } from '../../features/auth/state/auth.store.ts';
import { authGuard } from './auth.guard.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(), deleteItemAsync: vi.fn() }));

@Component({
  selector: 'app-guard-host',
  imports: [View],
  template: '<view />',
})
class GuardHost {}

const run = async (token: string | null) => {
  const store = { accessToken: signal<string | null>(token) };
  const router = { createUrlTree: vi.fn((commands: string[]) => ({ commands })) };
  const { componentRef } = await render(GuardHost, {
    providers: [
      { provide: AuthStore, useValue: store },
      { provide: Router, useValue: router },
    ],
  });
  return { router, result: runInInjectionContext(componentRef.injector, () => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)) };
};

test('redirects to the sign-in page when there is no session', async () => {
  const { router, result } = await run(null);

  expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  expect(result).toEqual({ commands: ['/login'] });
});

test('lets the user through when there is a session', async () => {
  const { result } = await run('token');

  expect(result).toBe(true);
});
