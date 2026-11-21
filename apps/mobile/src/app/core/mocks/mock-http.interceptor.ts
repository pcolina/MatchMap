import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { logout, refresh, signIn, type MockHttpResult } from '@matchmap/shared';
import { getMockState, mockContext, setMockState } from './mock-state.ts';

const toHttpResponse = (request: Parameters<HttpInterceptorFn>[0], result: MockHttpResult) => {
  setMockState(result.state);
  if (result.status >= 400) {
    const headers = result.retryAfterSeconds === undefined ? undefined : new HttpHeaders({ 'Retry-After': String(result.retryAfterSeconds) });
    return throwError(() => new HttpErrorResponse({ status: result.status, error: result.body, headers, url: request.url }));
  }
  return of(new HttpResponse({ status: result.status, body: result.body ?? null, url: request.url }));
};

export const mockHttpInterceptor: HttpInterceptorFn = (request, next) => {
  const path = new URL(request.url, 'http://local').pathname;
  const client = request.headers.get('X-Client') ?? undefined;
  const body = (request.body ?? {}) as { email?: string; password?: string; refreshToken?: string };
  if (request.method === 'POST' && path === '/api/auth/login') {
    return toHttpResponse(request, signIn(getMockState(), { client, email: body.email ?? '', password: body.password ?? '' }, mockContext()));
  }
  if (request.method === 'POST' && path === '/api/auth/refresh') {
    return toHttpResponse(request, refresh(getMockState(), { client, refreshToken: body.refreshToken }, mockContext()));
  }
  if (request.method === 'POST' && path === '/api/auth/logout') {
    return toHttpResponse(request, logout(getMockState(), { client, refreshToken: body.refreshToken }, mockContext()));
  }
  return next(request);
};
