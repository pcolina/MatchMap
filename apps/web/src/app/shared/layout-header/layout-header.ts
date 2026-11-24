import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-layout-header',
  imports: [NgIcon, TranslatePipe],
  template: `<header class="layout-header">
    <img class="logo" [attr.src]="logoSrc()" alt="matchMap" />
    <div class="actions">
      <button type="button" class="control" [attr.aria-label]="'account.sheet.notifications' | translate">
        <ng-icon name="tablerBell" />
        <span class="notification-dot" aria-hidden="true"></span>
      </button>
      <button type="button" class="control" [attr.aria-label]="'map.controls.account' | translate" (click)="accountPressed.emit()">
        <ng-icon name="tablerUser" />
      </button>
    </div>
  </header>`,
  styleUrl: './layout-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {
  readonly darkMode = input(false);
  readonly accountPressed = output<void>();
  protected readonly logoSrc = computed(() => (this.darkMode() ? '/brand/horizontal-on-dark.svg' : '/brand/horizontal-on-light.svg'));
}
