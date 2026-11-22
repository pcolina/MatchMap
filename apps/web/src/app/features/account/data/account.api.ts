import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { meQuery, type MeQuery } from '@matchmap/shared';
import { map, Observable } from 'rxjs';
import type { AccountGateway, AccountUser } from '../state/account.store';

@Injectable({ providedIn: 'root' })
export class AccountApi implements AccountGateway {
  private readonly apollo = inject(Apollo);

  me(): Observable<AccountUser> {
    return this.apollo
      .query<MeQuery>({ query: gql(meQuery), fetchPolicy: 'network-only' })
      .pipe(
        map(({ data }) => {
          if (!data) {
            throw new Error('The Me query returned no data');
          }
          return { username: data.me.username, email: data.me.email };
        }),
      );
  }
}
