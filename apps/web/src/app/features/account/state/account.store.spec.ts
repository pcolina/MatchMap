import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ACCOUNT_GATEWAY, AccountGateway, AccountStore } from './account.store';

const setup = (gateway: AccountGateway) => {
  TestBed.configureTestingModule({ providers: [{ provide: ACCOUNT_GATEWAY, useValue: gateway }] });
  return TestBed.inject(AccountStore);
};

describe('AccountStore', () => {
  it('fills the username and the email from the gateway', () => {
    const store = setup({ me: () => of({ username: 'ana', email: 'ana@example.test' }) });

    store.load();

    expect(store.username()).toBe('ana');
    expect(store.email()).toBe('ana@example.test');
  });

  it('keeps the username and the email empty when the query fails', () => {
    const store = setup({ me: () => throwError(() => new Error('network')) });

    store.load();

    expect(store.username()).toBeNull();
    expect(store.email()).toBeNull();
  });
});
