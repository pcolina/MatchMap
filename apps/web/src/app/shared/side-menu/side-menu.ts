import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-menu',
  imports: [NgIcon, TranslatePipe],
  template: `<nav class="side-menu" [attr.aria-label]="'map.sideMenu.label' | translate">
    <button type="button" class="item add-place" (click)="addPlacePressed.emit()">
      <ng-icon name="tablerPlus" />
      <span>{{ 'map.controls.addPlace' | translate }}</span>
    </button>
    <button type="button" class="item friends" (click)="friendsPressed.emit()">
      <ng-icon name="tablerUsers" />
      <span>{{ 'map.controls.friends' | translate }}</span>
    </button>
    <a class="skip" href="#main-content">{{ 'map.sideMenu.skip' | translate }}</a>
  </nav>`,
  styleUrl: './side-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenu {
  readonly addPlacePressed = output<void>();
  readonly friendsPressed = output<void>();
}
