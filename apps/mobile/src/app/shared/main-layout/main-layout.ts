import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SafeAreaView, View } from '@ng-native/components';
import { ColorScheme } from '@ng-native/device';
import { colors } from '../../core/theme/tokens.ts';
import { MapView } from '../map-view/map-view.ts';
import { StatsResume } from '../stats-resume/stats-resume.ts';

@Component({
  selector: 'app-main-layout',
  imports: [SafeAreaView, View, MapView, StatsResume],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<safe-area-view testID="main-safe-area" class="layout" [style.backgroundColor]="palette().bg">
    <view testID="map-area" [style.flex]="1" [style.backgroundColor]="palette().bg">
      <app-map-view />
    </view>
    <app-stats-resume />
  </safe-area-view>`,
  styles: `
    :host {
      flex: 1;
    }
    .layout {
      flex: 1;
    }
  `,
})
export class MainLayout {
  private readonly scheme = inject(ColorScheme);

  protected readonly palette = computed(() => colors[this.scheme.current()]);
}
