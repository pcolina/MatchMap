import type { Observable } from 'rxjs';

export type SignInFailure = 'invalidCredentials' | 'invalidRefreshToken' | 'tooManyAttempts' | 'network' | 'unknown';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInGateway {
  signIn(email: string, password: string): Observable<Tokens>;
  refresh(refreshToken: string): Observable<Tokens>;
}

export interface RefreshTokenWriter {
  write(refreshToken: string): Promise<void>;
}
