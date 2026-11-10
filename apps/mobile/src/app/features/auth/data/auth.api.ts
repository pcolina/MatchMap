import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { normalizeEmail, type components } from '@matchmap/shared';
import { catchError, map, Observable, throwError } from 'rxjs';
import type { SignInFailure, SignInGateway, Tokens } from '../state/auth.model.ts';

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

  signIn(email: string, password: string): Observable<Tokens> {
    return this.tokens(
      this.http.post<TokenResponse>(
        '/api/auth/login',
        { email: normalizeEmail(email), password },
        { headers: { 'X-Client': 'mobile' } },
      ),
    );
  }

  refresh(refreshToken: string): Observable<Tokens> {
    return this.tokens(
      this.http.post<TokenResponse>(
        '/api/auth/refresh',
        { refreshToken },
        { headers: { 'X-Client': 'mobile' } },
      ),
    );
  }

  private tokens(request: Observable<TokenResponse>): Observable<Tokens> {
    return request.pipe(
      map(({ accessToken, refreshToken }) => {
        if (refreshToken === undefined) {
          throw new Error('The mobile token response has no refresh token');
        }
        return { accessToken, refreshToken };
      }),
      catchError((error: unknown) => throwError(() => toFailure(error))),
    );
  }
}
