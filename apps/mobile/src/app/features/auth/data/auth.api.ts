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
import { catchError, map, Observable, throwError } from 'rxjs';
import type { RegisterFailure, SignInFailure, SignInGateway, Tokens } from '../state/auth.model.ts';

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
