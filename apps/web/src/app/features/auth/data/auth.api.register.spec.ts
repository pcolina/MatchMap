import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { AuthApi } from './auth.api';

const registeredUser = { register: { id: '1', email: 'user@example.com', createdAt: '2026-11-10T00:00:00Z' } };

const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('AuthApi register', () => {
  let api: AuthApi;
  let apollo: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(AuthApi);
    apollo = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    apollo.verify();
  });

  it('sends one Register mutation with the normalised email and the password only', async () => {
    let registered = false;
    api.register(' User@Example.com ', 'Abc!12').subscribe(() => (registered = true));

    const operation = apollo.expectOne('Register');
    expect(operation.operation.variables).toEqual({ input: { email: 'user@example.com', password: 'Abc!12' } });

    operation.flushData(registeredUser);
    await settle();

    expect(registered).toBe(true);
  });

  it('maps EMAIL_TAKEN to the email taken failure', async () => {
    let failure: unknown;
    api.register('user@example.com', 'Abc!12').subscribe({ error: (error) => (failure = error) });

    apollo.expectOne('Register').graphqlErrors([{ message: 'taken', extensions: { code: 'EMAIL_TAKEN' } }]);
    await settle();

    expect(failure).toBe('emailTaken');
  });

  it('maps PASSWORD_INVALID to the password invalid failure', async () => {
    let failure: unknown;
    api.register('user@example.com', 'abc').subscribe({ error: (error) => (failure = error) });

    apollo
      .expectOne('Register')
      .graphqlErrors([{ message: 'weak', extensions: { code: 'PASSWORD_INVALID', field: 'password' } }]);
    await settle();

    expect(failure).toBe('passwordInvalid');
  });

  it('maps a request with no connection to the network failure', async () => {
    let failure: unknown;
    api.register('user@example.com', 'Abc!12').subscribe({ error: (error) => (failure = error) });

    apollo.expectOne('Register').networkError(new HttpErrorResponse({ status: 0 }));
    await settle();

    expect(failure).toBe('network');
  });

  it('maps any other error to the unknown failure', async () => {
    let failure: unknown;
    api.register('user@example.com', 'Abc!12').subscribe({ error: (error) => (failure = error) });

    apollo.expectOne('Register').graphqlErrors([{ message: 'boom', extensions: { code: 'INTERNAL' } }]);
    await settle();

    expect(failure).toBe('unknown');
  });
});
