import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMockHandlers, mockHttpDispatch } from './mock-dispatch';

describe('mockHttpDispatch', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([mockHttpDispatch])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    installMockHandlers(undefined);
    backend.verify();
  });

  it('passes requests to the API when no mock handler is installed', () => {
    http.post('/api/auth/login', {}).subscribe();

    backend.expectOne('/api/auth/login').flush({});
  });

  it('hands requests to the installed mock handler', () => {
    const handler = vi.fn((request, next) => next(request));
    installMockHandlers({ http: handler, apollo: undefined as never });

    http.get('/api/other').subscribe();

    expect(handler).toHaveBeenCalledTimes(1);
    backend.expectOne('/api/other').flush({});
  });
});
