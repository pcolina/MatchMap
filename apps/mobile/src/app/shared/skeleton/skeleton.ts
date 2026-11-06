import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { View } from '@ng-native/components';
import { Accessibility } from '@ng-native/device';
import { colors, motion, radius, size } from '../../core/theme/tokens.ts';

export type SkeletonShape = 'field' | 'button';

@Component({
  selector: 'app-skeleton',
  imports: [View],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <view testID="skeleton">
      @for (shape of shapes(); track $index) {
        <view
          [testID]="'skeleton-' + shape"
          [style.backgroundColor]="colors.light.border"
          [style.borderRadius]="radius.md"
          [style.height]="shape === 'field' ? size.inputHeight : size.buttonHeight"
          [style.animationName]="reduceMotion() ? 'none' : 'skeleton-pulse'"
          [style.animationDuration]="motion.base + 'ms'"
        />
      }
    </view>
  `,
  styles: `
    :host {
      flex-direction: column;
    }
    @keyframes skeleton-pulse {
      from {
        opacity: 1;
      }
      to {
        opacity: 0.5;
      }
    }
  `,
})
export class SkeletonComponent {
  readonly shapes = input<readonly SkeletonShape[]>([]);
  readonly reduceMotion = inject(Accessibility).reduceMotion;
  protected readonly colors = colors;
  protected readonly motion = motion;
  protected readonly radius = radius;
  protected readonly size = size;
}
