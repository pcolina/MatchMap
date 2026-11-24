import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-button',
  imports: [NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" class="control" [attr.aria-label]="accountLabel()" [attr.aria-expanded]="accountOpen()" (click)="accountPressed.emit()">
    @if (avatarLoading()) {
      <span class="skeleton" data-testid="avatar-skeleton" aria-hidden="true"></span>
    } @else {
      <ng-icon name="tablerUser" [attr.data-icon]="'tablerUser'" />
    }
    @if (pendingCount() > 0) {
      <span class="notification-dot" data-testid="notification-dot" aria-hidden="true"></span>
    }
  </button>`,
  styleUrl: './account-button.css',
})
export class AccountButton {
  readonly avatarLoading = input(false);
  readonly accountOpen = input(false);
  readonly pendingCount = input(0);
  readonly accountPressed = output<void>();
  private readonly translate = inject(TranslateService);

  protected accountLabel(): string {
    const count = this.pendingCount();
    return count > 0 ? this.translate.instant('account.avatar.labelWithPending', { count }) : this.translate.instant('map.controls.account');
  }
}
