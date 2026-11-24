import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountButton } from '../account-button/account-button';

@Component({
  selector: 'app-map-top-controls',
  imports: [NgIcon, TranslatePipe, AccountButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="column" data-column="top-left">
      <button type="button" class="control" [attr.aria-label]="'map.controls.addPlace' | translate">
        <ng-icon name="tablerPlus" [attr.data-icon]="'tablerPlus'" />
      </button>
      <button type="button" class="control" [attr.aria-label]="'map.controls.friends' | translate">
        <ng-icon name="tablerUsers" [attr.data-icon]="'tablerUsers'" />
      </button>
    </div>
    <div class="column" data-column="top-right">
      <app-account-button [accountOpen]="accountOpen()" [avatarLoading]="avatarLoading()" [pendingCount]="pendingCount()" (accountPressed)="accountPressed.emit()" />
    </div>`,
  styleUrl: './map-top-controls.css',
})
export class MapTopControls {
  readonly avatarLoading = input(false);
  readonly accountOpen = input(false);
  readonly pendingCount = input(0);
  readonly accountPressed = output<void>();
}
