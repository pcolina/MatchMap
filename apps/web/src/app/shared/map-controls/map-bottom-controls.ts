import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-map-bottom-controls',
  imports: [NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
      type="button"
      class="control"
      [attr.aria-label]="(globeActive() ? 'map.controls.mercator' : 'map.controls.globe') | translate"
      [attr.aria-pressed]="globeActive()"
      (click)="pressed.emit()"
    >
      <ng-icon [name]="icon()" [attr.data-icon]="icon()" />
    </button>`,
  styleUrl: './map-bottom-controls.css',
})
export class MapBottomControls {
  readonly globeActive = input(false);
  readonly pressed = output<void>();

  protected readonly icon = computed(() => (this.globeActive() ? 'tablerMap' : 'globeWorld'));
}
