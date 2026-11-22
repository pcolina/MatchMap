import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { AccountApi } from './account.api';

const settle = () => new Promise<void>((resolve) => setTimeout(resolve));

describe('AccountApi', () => {
  let api: AccountApi;
  let apollo: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    api = TestBed.inject(AccountApi);
    apollo = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    apollo.verify();
  });

  it('runs one Me query and maps me to the username and the email', async () => {
    let user: unknown;
    api.me().subscribe((value) => (user = value));

    const operation = apollo.expectOne('Me');
    operation.flushData({ me: { id: '1', email: 'ana@example.test', username: 'ana', createdAt: '2026-11-10T00:00:00Z' } });
    await settle();

    expect(user).toEqual({ username: 'ana', email: 'ana@example.test' });
  });
});
