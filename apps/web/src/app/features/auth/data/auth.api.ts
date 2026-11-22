import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { Apollo, gql } from 'apollo-angular';
import {
  normalizeEmail,
  registerMutation,
  type components,
  type RegisterMutation,
  type RegisterMutationVariables,
} from '@matchmap/shared';
import { map, Observable, throwError, catchError } from 'rxjs';
import type { RegisterFailure, SignInFailure, SignInGateway } from '../state/auth.store';
import { apiUrl } from '../../../core/api-url';
import { environment } from '../../../../environments/environment';

type TokenResponse = components['schemas']['TokenResponse'];
type ErrorResponse = components['schemas']['Error'];

const toRegisterFailure = (error: unknown): RegisterFailure => {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.['code'];
    if (code === 'EMAIL_TAKEN') {
      return 'emailTaken';
    }
    if (code === 'PASSWORD_INVALID') {
      return 'passwordInvalid';
    }
    return 'unknown';
  }
  if (error instanceof HttpErrorResponse && error.status === 0) {
    return 'network';
  }
  return 'unknown';
};

const toFailure = (error: unknown): SignInFailure => {
  if (!(error instanceof HttpErrorResponse)) {
    return 'unknown';
  }
  if (error.status === 0) {
    return 'network';
  }
  const code: string | undefined = (error.error as ErrorResponse | null)?.error;
  if (code === 'invalid_credentials') {
    return 'invalidCredentials';
  }
  if (code === 'too_many_attempts') {
    return 'tooManyAttempts';
  }
  if (code === 'invalid_refresh_token') {
    return 'invalidRefreshToken';
  }
  if (code === 'invalid_email') {
    return 'invalidEmail';
  }
  if (code === 'email_too_long') {
    return 'emailTooLong';
  }
  if (code === 'invalid_password') {
    return 'invalidPassword';
  }
  return 'unknown';
};

@Injectable({ providedIn: 'root' })
export class AuthApi implements SignInGateway {
  private readonly http = inject(HttpClient);
  private readonly apollo = inject(Apollo);

  register(email: string, password: string): Observable<void> {
    return this.apollo
      .mutate<RegisterMutation, RegisterMutationVariables>({
        mutation: gql(registerMutation),
        variables: { input: { email: normalizeEmail(email), password } },
      })
      .pipe(
        map(() => undefined),
        catchError((error: unknown) => throwError(() => toRegisterFailure(error))),
      );
  }

  signIn(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http
      .post<TokenResponse>(
        apiUrl('/api/auth/login', environment.apiBaseUrl),
        { email: normalizeEmail(email), password },
        { withCredentials: true, headers: { 'X-Client': 'web' } },
      )
      .pipe(
        map(({ accessToken }) => ({ accessToken })),
        catchError((error: unknown) => throwError(() => toFailure(error))),
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(apiUrl('/api/auth/logout', environment.apiBaseUrl), null, {
        withCredentials: true,
        headers: { 'X-Client': 'web' },
      })
      .pipe(map(() => undefined));
  }

  refresh(): Observable<{ accessToken: string }> {
    return this.http
      .post<TokenResponse>(apiUrl('/api/auth/refresh', environment.apiBaseUrl), null, {
        withCredentials: true,
        headers: { 'X-Client': 'web' },
      })
      .pipe(
        map(({ accessToken }) => ({ accessToken })),
        catchError((error: unknown) => throwError(() => toFailure(error))),
      );
  }
}
