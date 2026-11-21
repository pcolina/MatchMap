import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats-resume',
  imports: [TranslatePipe],
  template: `<button type="button" class="stats-resume" [attr.aria-label]="'stats.resume.label' | translate" (click)="press.emit()"></button>`,
  styleUrl: './stats-resume.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsResume {
  readonly press = output<void>();
}
