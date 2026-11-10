import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export type SkeletonShape = 'field' | 'button';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class SkeletonComponent {
  readonly shapes = input<readonly SkeletonShape[]>([]);
  readonly reducedMotion = signal(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
