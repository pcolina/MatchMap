import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { normalizeEmail, type components } from '@matchmap/shared';
import { map, Observable, throwError, catchError } from 'rxjs';
import type { SignInFailure, SignInGateway } from '../state/auth.store';

type TokenResponse = components['schemas']['TokenResponse'];
type ErrorResponse = components['schemas']['Error'];

const toFailure = (error: unknown): SignInFailure => {
  if (!(error instanceof HttpErrorResponse)) {
    return 'unknown';
  }
  if (error.status === 0) {
    return 'network';
  }
  const code = (error.error as ErrorResponse | null)?.error;
  if (code === 'invalid_credentials') {
    return 'invalidCredentials';
  }
  if (code === 'too_many_attempts') {
    return 'tooManyAttempts';
  }
  if (code === 'invalid_refresh_token') {
    return 'invalidRefreshToken';
  }
  return 'unknown';
};

@Injectable({ providedIn: 'root' })
export class AuthApi implements SignInGateway {
  private readonly http = inject(HttpClient);

  signIn(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http
      .post<TokenResponse>(
        '/api/auth/login',
        { email: normalizeEmail(email), password },
        { withCredentials: true, headers: { 'X-Client': 'web' } },
      )
      .pipe(
        map(({ accessToken }) => ({ accessToken })),
        catchError((error: unknown) => throwError(() => toFailure(error))),
      );
  }

  refresh(): Observable<{ accessToken: string }> {
    return this.http
      .post<TokenResponse>('/api/auth/refresh', null, {
        withCredentials: true,
        headers: { 'X-Client': 'web' },
      })
      .pipe(
        map(({ accessToken }) => ({ accessToken })),
        catchError((error: unknown) => throwError(() => toFailure(error))),
      );
  }
}
