import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountButton } from '../account-button/account-button';

@Component({
  selector: 'app-layout-header',
  imports: [NgIcon, TranslatePipe, AccountButton],
  template: `<header class="layout-header">
    <img class="logo" [attr.src]="logoSrc()" alt="matchMap" />
    <div class="actions">
      <button type="button" class="control" [attr.aria-label]="(pendingCount() > 0 ? 'account.sheet.notificationsWithPending' : 'account.sheet.notifications') | translate: { count: pendingCount() }">
        <ng-icon name="tablerBell" />
        @if (pendingCount() > 0) {
          <span class="notification-dot" aria-hidden="true">{{ pendingCount() }}</span>
        }
      </button>
      <app-account-button (accountPressed)="accountPressed.emit()" />
    </div>
  </header>`,
  styleUrl: './layout-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {
  readonly darkMode = input(false);
  readonly pendingCount = input(0);
  readonly accountPressed = output<void>();
  protected readonly logoSrc = computed(() => (this.darkMode() ? '/brand/horizontal-on-dark.svg' : '/brand/horizontal-on-light.svg'));
}
