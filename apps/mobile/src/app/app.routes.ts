import type { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard.ts';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/sign-in/sign-in.page.ts').then((module) => module.SignInPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/main-layout/main-layout.ts').then((module) => module.MainLayout),
  },
];
