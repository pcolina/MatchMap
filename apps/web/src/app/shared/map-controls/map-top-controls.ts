import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

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
      <button type="button" class="control" [attr.aria-label]="'map.controls.account' | translate" [attr.aria-expanded]="accountOpen()" (click)="accountPressed.emit()">
        @if (avatarLoading()) {
          <span class="skeleton" data-testid="avatar-skeleton" aria-hidden="true"></span>
        } @else {
          <ng-icon name="tablerUser" [attr.data-icon]="'tablerUser'" />
        }
      </button>
    </div>`,
  styleUrl: './map-top-controls.css',
})
export class MapTopControls {
  readonly avatarLoading = input(false);
  readonly accountOpen = input(false);
  readonly accountPressed = output<void>();
}
