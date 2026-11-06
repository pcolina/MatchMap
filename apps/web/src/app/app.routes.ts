import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/sign-in/sign-in.page').then((module) => module.SignInPage),
  },
  {
    path: '',
    loadComponent: () => import('./shared/main-layout/main-layout').then((module) => module.MainLayout),
  },
];
