import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../features/auth/state/auth.store';

export const authGuard: CanActivateFn = () =>
  inject(AuthStore).accessToken() ? true : inject(Router).createUrlTree(['/login']);
