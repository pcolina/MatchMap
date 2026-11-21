import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { signIn, type MockHttpResult } from '@matchmap/shared';
import { getMockState, mockContext, setMockState } from './mock-state';

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
  if (request.method === 'POST' && path === '/api/auth/login') {
    const body = request.body as { email: string; password: string };
    return toHttpResponse(request, signIn(getMockState(), { client, email: body.email, password: body.password }, mockContext()));
  }
  return next(request);
};
