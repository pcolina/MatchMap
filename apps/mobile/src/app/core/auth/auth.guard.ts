import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../features/auth/state/auth.store.ts';

export const authGuard: CanActivateFn = () =>
  inject(AuthStore).accessToken() !== null ? true : inject(Router).createUrlTree(['/login']);
