import '@angular/compiler';
import { expect, test, vi } from 'vitest';
import { authGuard } from './core/auth/auth.guard.ts';
import { routes } from './app.routes.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(), deleteItemAsync: vi.fn() }));

test('loads the sign-in page lazily at /login', () => {
  const login = routes.find((route) => route.path === 'login');

  expect(login?.loadComponent).toBeTypeOf('function');
  expect(login?.canActivate).toBeUndefined();
});

test('loads the main layout lazily at /, behind the session guard', () => {
  const main = routes.find((route) => route.path === '');

  expect(main?.loadComponent).toBeTypeOf('function');
  expect(main?.canActivate).toEqual([authGuard]);
});
