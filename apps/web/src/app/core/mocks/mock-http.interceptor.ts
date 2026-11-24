import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { logout, refresh, signIn, type MockHttpResult, type MockState } from '@matchmap/shared';
import { getMockState, mockContext, setMockState } from './mock-state';

let webRefreshCookie: string | undefined;

const notificationsStorageKey = 'matchmap.notifications.pending';

const applyUnreadNotifications = (email: string, state: MockState): void => {
  const user = state.users.find((candidate) => candidate.email === email.trim().toLowerCase());
  try {
    localStorage.setItem(notificationsStorageKey, String(user?.unreadNotifications ?? 0));
  } catch {
    return;
  }
};

export const resetWebRefreshCookie = (): void => {
  webRefreshCookie = undefined;
};

const toHttpResponse = (request: Parameters<HttpInterceptorFn>[0], result: MockHttpResult, client: string | undefined) => {
  setMockState(result.state);
  if (client === 'web') {
    webRefreshCookie = result.status === 204 && request.url.endsWith('/logout') ? undefined : (result.refreshToken ?? webRefreshCookie);
  }
  if (result.status >= 400) {
    const headers = result.retryAfterSeconds === undefined ? undefined : new HttpHeaders({ 'Retry-After': String(result.retryAfterSeconds) });
    return throwError(() => new HttpErrorResponse({ status: result.status, error: result.body, headers, url: request.url }));
  }
  return of(new HttpResponse({ status: result.status, body: result.body ?? null, url: request.url }));
};

export const mockHttpInterceptor: HttpInterceptorFn = (request, next) => {
  const path = new URL(request.url, 'http://local').pathname;
  const client = request.headers.get('X-Client') ?? undefined;
  if (request.method === 'POST' && path === '/api/auth/login') {
    const body = request.body as { email: string; password: string };
    const result = signIn(getMockState(), { client, email: body.email, password: body.password }, mockContext());
    if (result.status === 200) {
      applyUnreadNotifications(body.email, result.state);
    }
    return toHttpResponse(request, result, client);
  }
  if (request.method === 'POST' && path === '/api/auth/refresh') {
    const token = client === 'web' ? webRefreshCookie : (request.body as { refreshToken?: string } | null)?.refreshToken;
    return toHttpResponse(request, refresh(getMockState(), { client, refreshToken: token }, mockContext()), client);
  }
  if (request.method === 'POST' && path === '/api/auth/logout') {
    const token = client === 'web' ? webRefreshCookie : (request.body as { refreshToken?: string } | null)?.refreshToken;
    return toHttpResponse(request, logout(getMockState(), { client, refreshToken: token }, mockContext()), client);
  }
  return next(request);
};
