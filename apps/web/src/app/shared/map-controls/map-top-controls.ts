import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-map-top-controls',
  imports: [NgIcon, TranslatePipe],
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
      <button type="button" class="control" [attr.aria-label]="accountLabel()" [attr.aria-expanded]="accountOpen()" (click)="accountPressed.emit()">
        @if (avatarLoading()) {
          <span class="skeleton" data-testid="avatar-skeleton" aria-hidden="true"></span>
        } @else {
          <ng-icon name="tablerUser" [attr.data-icon]="'tablerUser'" />
        }
        @if (pendingCount() > 0) {
          <span class="notification-dot" data-testid="notification-dot" aria-hidden="true"></span>
        }
      </button>
    </div>`,
  styleUrl: './map-top-controls.css',
})
export class MapTopControls {
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
