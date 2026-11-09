import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColorScheme } from '@ng-native/device';
import { Pressable } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { TranslateService } from '@ngx-translate/core';
import { colors, radius, size } from '../../../../core/theme/tokens.ts';

@Component({
  selector: 'app-language-switcher',
  imports: [NgIcon, Pressable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pressable
      accessibilityRole="button"
      [accessibilityLabel]="t('login.signIn.languageSwitcher')"
      [style.width]="size.touchTargetMin"
      [style.height]="size.touchTargetMin"
      [style.borderRadius]="radius.pill"
      [style.backgroundColor]="palette().surface"
      [style.alignItems]="'center'"
      [style.justifyContent]="'center'"
      [style.shadowColor]="'#111827'"
      [style.shadowOpacity]="0.1"
      [style.shadowRadius]="3"
    >
      <ng-icon name="tablerLanguage" [color]="palette().textSecondary" />
    </pressable>
  `,
})
export class LanguageSwitcherComponent {
  private readonly scheme = inject(ColorScheme);
  private readonly translate = inject(TranslateService);
  protected t(key: string): string {
    return this.translate.instant(key);
  }
  protected readonly palette = computed(() => colors[this.scheme.current()]);
  protected readonly radius = radius;
  protected readonly size = size;
}
