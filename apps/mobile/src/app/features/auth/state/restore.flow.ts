import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import type { RefreshTokenWriter, SignInGateway } from './auth.model.ts';

export type RestoreOutcome = { kind: 'restored'; accessToken: string } | { kind: 'anonymous' };

export interface RefreshTokenStore extends RefreshTokenWriter {
  read(): Promise<string | null>;
  clear(): Promise<void>;
}

export const restoreFlow = (
  gateway: Pick<SignInGateway, 'refresh'>,
  storage: RefreshTokenStore,
): Observable<RestoreOutcome> =>
  from(storage.read()).pipe(
    switchMap((storedToken) => {
      if (storedToken === null) {
        return of<RestoreOutcome>({ kind: 'anonymous' });
      }
      return gateway.refresh(storedToken).pipe(
        switchMap((tokens) =>
          from(storage.write(tokens.refreshToken)).pipe(
            map((): RestoreOutcome => ({ kind: 'restored', accessToken: tokens.accessToken })),
          ),
        ),
        catchError(() =>
          from(storage.clear()).pipe(map((): RestoreOutcome => ({ kind: 'anonymous' }))),
        ),
      );
    }),
  );
