import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import type { RefreshTokenWriter, SignInFailure, SignInGateway } from './auth.model.ts';

export type SignInOutcome =
  | { kind: 'signedIn'; accessToken: string }
  | { kind: 'failed'; failure: SignInFailure };

const toFailure = (error: unknown): SignInFailure =>
  error === 'invalidCredentials' ||
  error === 'tooManyAttempts' ||
  error === 'invalidEmail' ||
  error === 'emailTooLong' ||
  error === 'invalidPassword' ||
  error === 'network'
    ? error
    : 'unknown';

export const signInFlow = (
  gateway: SignInGateway,
  storage: RefreshTokenWriter,
  email: string,
  password: string,
): Observable<SignInOutcome> =>
  gateway.signIn(email, password).pipe(
    switchMap((tokens) =>
      from(storage.write(tokens.refreshToken)).pipe(
        map((): SignInOutcome => ({ kind: 'signedIn', accessToken: tokens.accessToken })),
      ),
    ),
    catchError((error: unknown) => of<SignInOutcome>({ kind: 'failed', failure: toFailure(error) })),
  );
