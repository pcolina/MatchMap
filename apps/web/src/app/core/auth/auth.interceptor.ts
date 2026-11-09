import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthStore, SIGN_IN_GATEWAY } from '../../features/auth/state/auth.store';

const withAccessToken = (request: HttpRequest<unknown>, accessToken: string | null) =>
  accessToken ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }) : request;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith('/api/auth/')) {
    return next(request);
  }
  const store = inject(AuthStore);
  const gateway = inject(SIGN_IN_GATEWAY);
  const router = inject(Router);

  return next(withAccessToken(request, store.accessToken())).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }
      return gateway.refresh().pipe(
        tap(({ accessToken }) => store.setAccessToken(accessToken)),
        switchMap(() => next(withAccessToken(request, store.accessToken()))),
        catchError((retryError: unknown) => {
          store.signOut();
          void router.navigateByUrl('/login');
          return throwError(() => retryError);
        }),
      );
    }),
  );
};
