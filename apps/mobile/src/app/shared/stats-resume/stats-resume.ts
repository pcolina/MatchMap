import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Pressable } from '@ng-native/components';
import { ColorScheme } from '@ng-native/device';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '../../core/theme/tokens.ts';

@Component({
  selector: 'app-stats-resume',
  imports: [Pressable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<pressable
    testID="stats-resume"
    accessibilityRole="button"
    [accessibilityLabel]="t('stats.resume.label')"
    [style.height]="panelHeight"
    [style.overflow]="'hidden'"
    [style.backgroundColor]="palette().accent"
    (press)="press.emit()"
  />`,
  styles: `
    :host {
      flex: 0 0 auto;
    }
  `,
})
export class StatsResume {
  readonly press = output<void>();

  private readonly scheme = inject(ColorScheme);
  private readonly translate = inject(TranslateService);

  protected readonly panelHeight = 250;
  protected readonly palette = computed(() => colors[this.scheme.current()]);

  protected t(key: string): string {
    return this.translate.instant(key);
  }
}
