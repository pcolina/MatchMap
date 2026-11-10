import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/sign-in/sign-in.page').then((module) => module.SignInPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.page').then((module) => module.RegisterPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/main-layout/main-layout').then((module) => module.MainLayout),
  },
];
