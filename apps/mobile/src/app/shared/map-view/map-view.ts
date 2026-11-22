import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { MapState } from '@matchmap/shared';
import { ColorScheme } from '@ng-native/device';
import { TranslateService } from '@ngx-translate/core';
import { mapViewProps } from './map-view.props.ts';

@Component({
  selector: 'app-map-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<maplibre-map
    [style.flex]="1"
    accessibilityRole="image"
    [accessibilityLabel]="t('map.world.label')"
    [mapStyle]="props().mapStyle"
    [dragPan]="props().dragPan"
    [touchZoom]="props().touchZoom"
    [doubleTapZoom]="props().doubleTapZoom"
    [touchRotate]="props().touchRotate"
    [touchPitch]="props().touchPitch"
  />`,
  styles: `
    :host {
      flex: 1;
    }
  `,
})
export class MapView {
  readonly states = input<Record<string, MapState>>({});

  private readonly scheme = inject(ColorScheme);
  private readonly translate = inject(TranslateService);

  protected readonly props = computed(() =>
    mapViewProps(this.states(), this.scheme.current() === 'dark' ? 'night' : 'day'),
  );

  protected t(key: string): string {
    return this.translate.instant(key);
  }
}
