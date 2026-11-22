import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-map-bottom-controls',
  imports: [NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button
      type="button"
      class="control"
      [attr.aria-label]="'map.controls.attribution' | translate"
    >
      <ng-icon name="tablerInfoCircle" [attr.data-icon]="'tablerInfoCircle'" />
    </button>
    <button
      type="button"
      class="control"
      [attr.aria-label]="(globeActive() ? 'map.controls.globe' : 'map.controls.mercator') | translate"
      [attr.aria-pressed]="globeActive()"
    >
      <ng-icon [name]="icon()" [attr.data-icon]="icon()" />
    </button>`,
  styleUrl: './map-bottom-controls.css',
})
export class MapBottomControls {
  readonly globeActive = input(false);

  protected readonly icon = computed(() => (this.globeActive() ? 'tablerMap' : 'globeWorld'));
}
